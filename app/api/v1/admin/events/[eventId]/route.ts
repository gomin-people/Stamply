import {
  badRequest,
  notFound,
  ok,
  parsePositiveInteger,
  pickBodyFields,
  readJsonObject,
  serverError,
  toInteger,
} from '@/utils/api';
import { supabase } from '@/utils/supabase/server';

// 어드민 행사 상세 route parameter 타입
type AdminEventRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

// 행사 수정 시 요청 본문에서 허용하는 필드 목록
const EVENT_UPDATE_FIELDS = [
  'user_id',
  'title',
  'start_date',
  'end_date',
  'start_time',
  'end_time',
  'operating_remarks',
  'location',
  'notice',
  'contact',
  'production',
  'poster_image_url',
  'brochure_image_url',
  'stamp_image_url',
  'primary_color',
  'reward_stock',
] as const;

/**
 * 어드민 행사 상세, 미션, QR, 참여자 수를 함께 조회합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID route parameter
 * @returns 행사 상세와 관리자 화면에 필요한 연관 데이터
 */
export async function GET(
  request: Request,
  { params }: AdminEventRouteContext
) {
  void request;
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest('올바른 행사 ID가 필요합니다.');
  }

  // events 테이블에서 id가 eventId인 행사 전체 컬럼 조회
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .maybeSingle();

  if (eventError) {
    return serverError('어드민 행사 상세 조회 실패', eventError);
  }

  if (!event) {
    return notFound('행사를 찾을 수 없습니다.');
  }

  // 관리자 상세 화면에서 바로 쓰는 연관 데이터는 병렬로 조회
  const [
    { data: missions, error: missionsError },
    { data: qrCodes, error: qrCodesError },
    { count: participantCount, error: participantCountError },
  ] = await Promise.all([
    // missions 테이블에서 events_id가 eventId인 미션 목록을 sort_order, id 오름차순 조회
    supabase
      .from('missions')
      .select('*')
      .eq('events_id', eventId)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true }),
    // qr_codes 테이블에서 events_id가 eventId인 QR 목록을 created_at 오름차순 조회
    supabase
      .from('qr_codes')
      .select('*')
      .eq('events_id', eventId)
      .order('created_at', { ascending: true }),
    // participant_users 테이블에서 events_id가 eventId인 참여자 수 조회
    supabase
      .from('participant_users')
      .select('id', { count: 'exact', head: true })
      .eq('events_id', eventId),
  ]);

  if (missionsError) {
    return serverError('행사 미션 조회 실패', missionsError);
  }

  if (qrCodesError) {
    return serverError('행사 QR 조회 실패', qrCodesError);
  }

  if (participantCountError) {
    return serverError('행사 참여자 수 조회 실패', participantCountError);
  }

  return ok({
    ...event,
    missions: missions ?? [],
    qr_codes: qrCodes ?? [],
    participant_count: participantCount ?? 0,
  });
}

/**
 * 어드민 행사 정보를 부분 수정합니다.
 *
 * @param request - 수정할 행사 필드를 담은 JSON 본문
 * @param context - 행사 ID route parameter
 * @returns 수정된 행사 row
 */
export async function PATCH(
  request: Request,
  { params }: AdminEventRouteContext
) {
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest('올바른 행사 ID가 필요합니다.');
  }

  const result = await readJsonObject(request);

  if ('response' in result) {
    return result.response;
  }

  const payload = pickBodyFields(result.body, EVENT_UPDATE_FIELDS);

  if (Object.keys(payload).length === 0) {
    return badRequest('수정할 행사 필드가 필요합니다.');
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'user_id')) {
    const userId = toInteger(payload.user_id);

    if (userId === null || userId <= 0) {
      return badRequest('userId는 양의 정수여야 합니다.');
    }

    payload.user_id = userId;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'reward_stock')) {
    const rewardStock = toInteger(payload.reward_stock);

    if (rewardStock === null || rewardStock < 0) {
      return badRequest('rewardStock은 0 이상의 정수여야 합니다.');
    }

    payload.reward_stock = rewardStock;
  }

  // events 테이블에서 id가 eventId인 row를 요청 본문 필드와 updated_at으로 수정 후 조회
  const { data, error } = await supabase
    .from('events')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId)
    .select('*')
    .maybeSingle();

  if (error) {
    return serverError('행사 수정 실패', error);
  }

  if (!data) {
    return notFound('행사를 찾을 수 없습니다.');
  }

  return ok(data);
}

/**
 * 어드민 행사와 행사에 종속된 데이터를 삭제합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID route parameter
 * @returns 삭제된 행사 ID
 */
export async function DELETE(
  request: Request,
  { params }: AdminEventRouteContext
) {
  void request;
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest('올바른 행사 ID가 필요합니다.');
  }

  // events 테이블에서 id가 eventId인 삭제 대상 row 존재 여부 조회
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .maybeSingle();

  if (eventError) {
    return serverError('행사 삭제 대상 조회 실패', eventError);
  }

  if (!event) {
    return notFound('행사를 찾을 수 없습니다.');
  }

  // FK 제약을 고려해 하위 데이터부터 삭제
  const cleanupSteps = [
    // mission_completions 테이블에서 events_id가 eventId인 완료 기록 삭제
    supabase.from('mission_completions').delete().eq('events_id', eventId),
    // qr_codes 테이블에서 events_id가 eventId인 QR 코드 삭제
    supabase.from('qr_codes').delete().eq('events_id', eventId),
    // missions 테이블에서 events_id가 eventId인 미션 삭제
    supabase.from('missions').delete().eq('events_id', eventId),
    // participant_users 테이블에서 events_id가 eventId인 참여자 삭제
    supabase.from('participant_users').delete().eq('events_id', eventId),
  ];

  for (const step of cleanupSteps) {
    const { error } = await step;

    if (error) {
      return serverError('행사 연관 데이터 삭제 실패', error);
    }
  }

  // events 테이블에서 id가 eventId인 행사 row 삭제
  const { error: deleteEventError } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (deleteEventError) {
    return serverError('행사 삭제 실패', deleteEventError);
  }

  return ok({ id: eventId });
}
