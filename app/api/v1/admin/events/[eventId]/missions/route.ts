import {
  badRequest,
  created,
  getMissingFields,
  notFound,
  ok,
  parsePositiveInteger,
  pickBodyFields,
  readJsonObject,
  serverError,
} from '@/utils/api';
import { createSessionClient } from '@/utils/supabase/session-server';

// 행사 하위 미션 목록 route parameter 타입
type AdminEventMissionsRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

// 미션 생성 시 요청 본문에서 허용하는 필드 목록
const MISSION_INSERT_FIELDS = [
  'title',
  'description',
  'sort_order',
  'is_active',
] as const;

// 미션 생성에 필요한 최소 필드 목록
const MISSION_REQUIRED_FIELDS = ['title'] as const;

/**
 * 특정 행사의 어드민 미션 목록을 조회합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID route parameter
 * @returns sort_order 기준 미션 목록
 */
export async function GET(
  request: Request,
  { params }: AdminEventMissionsRouteContext
) {
  void request;
  const supabase = await createSessionClient();
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest('올바른 행사 ID가 필요합니다.');
  }

  // missions 테이블에서 events_id가 eventId인 미션 목록을 sort_order 오름차순 조회
  const { data, error } = await supabase
    .from('missions')
    .select(
      `
    *,
    qr_codes!inner(id, token)
  `
    )
    .eq('events_id', eventId)
    .eq('qr_codes.type', 'MISSION')
    .order('sort_order', { ascending: true });

  if (error) {
    return serverError('미션 목록 조회 실패', error);
  }

  return ok(data ?? []);
}

/**
 * 특정 행사에 미션을 생성하고 MISSION QR을 함께 발급합니다.
 *
 * @param request - 미션 생성 JSON 본문
 * @param context - 행사 ID route parameter
 * @returns 생성된 미션과 미션 QR
 */
export async function POST(
  request: Request,
  { params }: AdminEventMissionsRouteContext
) {
  const supabase = await createSessionClient();
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest('올바른 행사 ID가 필요합니다.');
  }

  const result = await readJsonObject(request);

  if ('response' in result) {
    return result.response;
  }

  // 프론트에서 camelCase로 전달된 isActive를 DB 필드명 is_active로 정규화
  const body = result.body;
  if ('isActive' in body) {
    body.is_active = body.isActive;
    delete body.isActive;
  }

  const missingFields = getMissingFields(body, MISSION_REQUIRED_FIELDS);

  if (missingFields.length > 0) {
    return badRequest('필수 미션 필드가 누락되었습니다.', {
      fields: missingFields,
    });
  }

  // events 테이블에서 id가 eventId인 미션 생성 대상 행사 존재 여부 조회
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .maybeSingle();

  if (eventError) {
    return serverError('행사 조회 실패', eventError);
  }

  if (!event) {
    return notFound('행사를 찾을 수 없습니다.');
  }

  const payload = pickBodyFields(body, MISSION_INSERT_FIELDS);
  // const sortOrder = toInteger(payload.sort_order);

  // if (
  //   Object.prototype.hasOwnProperty.call(payload, 'sort_order') &&
  //   sortOrder === null
  // ) {
  //   return badRequest('sortOrder는 정수여야 합니다.');
  // }

  if (
    Object.prototype.hasOwnProperty.call(payload, 'is_active') &&
    typeof payload.is_active !== 'boolean'
  ) {
    return badRequest('isActive는 boolean이어야 합니다.');
  }

  // missions 테이블에서 events_id가 eventId인 미션 중 가장 큰 sort_order 조회
  const { data: lastMission, error: lastMissionError } = await supabase
    .from('missions')
    .select('sort_order')
    .eq('events_id', eventId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastMissionError) {
    return serverError('미션 순서 조회 실패', lastMissionError);
  }

  // sort_order가 없으면 현재 행사의 마지막 순서 다음 값으로 배치
  const now = new Date().toISOString();
  const missionPayload = {
    ...payload,
    events_id: eventId,
    sort_order:
      typeof lastMission?.sort_order === 'number'
        ? lastMission.sort_order + 1
        : 1,
    is_active:
      typeof payload.is_active === 'boolean' ? payload.is_active : true,
    created_at: now,
    updated_at: now,
  };

  // missions 테이블에 events_id가 eventId인 미션 row 삽입 후 전체 컬럼 조회
  const { data: mission, error: missionError } = await supabase
    .from('missions')
    .insert(missionPayload)
    .select('*')
    .single();

  if (missionError) {
    return serverError('미션 생성 실패', missionError);
  }

  // qr_codes 테이블에 events_id, missions_id, type MISSION을 가진 QR row 삽입 후 조회
  const { data: qrCode, error: qrCodeError } = await supabase
    .from('qr_codes')
    .insert({
      events_id: eventId,
      missions_id: mission.id,
      type: 'MISSION',
      created_at: now,
    })
    .select('*')
    .single();

  if (qrCodeError) {
    // QR 생성 실패 시 고아 미션이 남지 않도록 생성된 미션을 정리
    // missions 테이블에서 QR 생성에 실패한 미션 id 기준으로 row 삭제
    await supabase.from('missions').delete().eq('id', mission.id);
    return serverError('미션 QR 생성 실패', qrCodeError);
  }

  return created({
    ...mission,
    qr_code: qrCode,
  });
}
