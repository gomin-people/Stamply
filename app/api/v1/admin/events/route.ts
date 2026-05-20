import { type NextRequest } from 'next/server';
import {
  badRequest,
  created,
  getMissingFields,
  ok,
  parseOptionalPositiveInteger,
  pickBodyFields,
  readJsonObject,
  serverError,
  toInteger,
} from '@/utils/api';
import { supabase } from '@/utils/supabase/server';

// 행사 생성 시 요청 본문에서 허용하는 필드 목록
const EVENT_INSERT_FIELDS = [
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

// DB not null 컬럼과 MVP 생성 플로우 기준의 필수 행사 필드
const EVENT_REQUIRED_FIELDS = [
  'user_id',
  'title',
  'start_date',
  'end_date',
  'start_time',
  'end_time',
  'location',
  'contact',
  'production',
] as const;

/**
 * 어드민 행사 목록을 조회합니다.
 *
 * @param request - userId query parameter를 포함할 수 있는 요청 객체
 * @returns userId가 있으면 해당 운영자의 행사 목록, 없으면 전체 행사 목록
 */
export async function GET(request: NextRequest) {
  const requestedUserId = request.nextUrl.searchParams.get('userId');
  const userId = parseOptionalPositiveInteger(requestedUserId);

  if (requestedUserId !== null && userId === null) {
    return badRequest('올바른 userId가 필요합니다.');
  }

  // events 테이블에서 user_id 조건을 선택적으로 적용해 생성일, id 내림차순으로 목록 조회
  let query = supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (userId !== null) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    return serverError('어드민 행사 목록 조회 실패', error);
  }

  return ok(data ?? []);
}

/**
 * 어드민 행사를 생성하고 ENTRY QR을 함께 발급합니다.
 *
 * @param request - 행사 생성 JSON 본문
 * @returns 생성된 행사와 입장 QR 코드 목록
 */
export async function POST(request: Request) {
  const result = await readJsonObject(request);

  if ('response' in result) {
    return result.response;
  }

  const missingFields = getMissingFields(result.body, EVENT_REQUIRED_FIELDS);

  if (missingFields.length > 0) {
    return badRequest('필수 행사 필드가 누락되었습니다.', {
      fields: missingFields,
    });
  }

  const userId = toInteger(result.body.user_id);

  if (userId === null || userId <= 0) {
    return badRequest('user_id는 양의 정수여야 합니다.');
  }

  const rewardStock = toInteger(result.body.reward_stock);

  if (
    Object.prototype.hasOwnProperty.call(result.body, 'reward_stock') &&
    (rewardStock === null || rewardStock < 0)
  ) {
    return badRequest('reward_stock은 0 이상의 정수여야 합니다.');
  }

  const now = new Date().toISOString();
  const eventPayload = {
    ...pickBodyFields(result.body, EVENT_INSERT_FIELDS),
    user_id: userId,
    ...(rewardStock === null ? {} : { reward_stock: rewardStock }),
    created_at: now,
    updated_at: now,
  };

  // events 테이블에 요청 본문 기반 행사 row 삽입 후 전체 컬럼 조회
  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert(eventPayload)
    .select('*')
    .single();

  if (eventError) {
    return serverError('행사 생성 실패', eventError);
  }

  // qr_codes 테이블에 events_id와 type ENTRY를 가진 입장 QR row 삽입 후 조회
  const { data: qrCodes, error: qrCodeError } = await supabase
    .from('qr_codes')
    .insert({
      events_id: event.id,
      missions_id: null,
      type: 'ENTRY',
      created_at: now,
    })
    .select('*');

  if (qrCodeError) {
    // QR 생성 실패 시 고아 행사가 남지 않도록 생성된 행사를 정리
    // events 테이블에서 생성된 행사 id 기준으로 row 삭제
    await supabase.from('events').delete().eq('id', event.id);
    return serverError('행사 QR 생성 실패', qrCodeError);
  }

  return created({
    ...event,
    qr_codes: qrCodes ?? [],
  });
}
