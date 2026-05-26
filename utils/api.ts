import { type NextRequest, NextResponse } from 'next/server';
import { snakeToCamel, toCamelKeys, toSnakeKeys } from '@/utils/case';
import { supabase } from '@/utils/supabase/server';

// 참여자 식별에 사용하는 HttpOnly 쿠키의 키 이름
export const PARTICIPANT_COOKIE_NAME = 'event_user_id';

// JSON 객체 형태의 요청/응답 데이터
export type JsonObject = Record<string, unknown>;

// participant_users 테이블에서 API가 공통으로 사용하는 참여자 row 타입
export type ParticipantRow = JsonObject & {
  id: number;
  events_id: number;
  user_id: number | null;
  event_user_id: string;
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN' | null;
  age_range: string | null;
  is_reward_claimed: boolean;
};

/**
 * API 성공 응답을 `{ data }` 형태로 통일하고 data key를 camelCase로 변환해 반환합니다.
 *
 * @param data - 응답 본문에 담을 데이터
 * @param init - 상태 코드, 헤더 등 Response 초기 옵션
 * @returns JSON 성공 응답
 */
export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ data: toCamelKeys(data) }, init);
}

/**
 * 리소스 생성 성공 응답을 반환합니다.
 *
 * @param data - 생성된 리소스 데이터
 * @returns 201 Created JSON 응답
 */
export function created(data: unknown) {
  return ok(data, { status: 201 });
}

/**
 * 요청 값이 잘못되었을 때 사용할 400 응답을 반환합니다.
 *
 * @param message - 클라이언트에 전달할 에러 메시지
 * @param details - 필드 목록 등 추가 에러 정보
 * @returns 400 Bad Request JSON 응답
 */
export function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    details === undefined
      ? { message }
      : { message, details: toCamelKeys(details) },
    { status: 400 }
  );
}

/**
 * 인증 정보가 없거나 유효하지 않을 때 사용할 401 응답을 반환합니다.
 *
 * @param message - 클라이언트에 전달할 에러 메시지
 * @returns 401 Unauthorized JSON 응답
 */
export function unauthorized(message = '참여자 정보가 없습니다.') {
  return NextResponse.json({ message }, { status: 401 });
}

/**
 * 요청 권한이 없을 때 사용할 403 응답을 반환합니다.
 *
 * @param message - 클라이언트에 전달할 에러 메시지
 * @returns 403 Forbidden JSON 응답
 */
export function forbidden(message = '요청 권한이 없습니다.') {
  return NextResponse.json({ message }, { status: 403 });
}

/**
 * 요청한 리소스를 찾지 못했을 때 사용할 404 응답을 반환합니다.
 *
 * @param message - 클라이언트에 전달할 에러 메시지
 * @returns 404 Not Found JSON 응답
 */
export function notFound(message: string) {
  return NextResponse.json({ message }, { status: 404 });
}

/**
 * 중복 요청이나 상태 충돌이 발생했을 때 사용할 409 응답을 반환합니다.
 *
 * @param message - 클라이언트에 전달할 에러 메시지
 * @param details - 충돌 원인을 설명하는 추가 정보
 * @returns 409 Conflict JSON 응답
 */
export function conflict(message: string, details?: unknown) {
  return NextResponse.json(
    details === undefined
      ? { message }
      : { message, details: toCamelKeys(details) },
    { status: 409 }
  );
}

/**
 * 서버 내부 오류를 클라이언트 응답 형태로 변환합니다.
 *
 * @param message - 클라이언트에 전달할 에러 메시지
 * @param error - Supabase 또는 런타임에서 발생한 원본 에러
 * @returns 500 Internal Server Error JSON 응답
 */
export function serverError(message: string, error: unknown) {
  return NextResponse.json(
    {
      message,
      error: getErrorMessage(error),
    },
    { status: 500 }
  );
}

/**
 * Supabase/Postgres 에러 객체에서 에러 코드를 꺼냅니다.
 *
 * @param error - 코드 속성이 있을 수 있는 에러 객체
 * @returns 에러 코드가 있으면 문자열, 없으면 null
 */
export function getErrorCode(error: unknown) {
  if (isRecord(error) && typeof error.code === 'string') {
    return error.code;
  }

  return null;
}

/**
 * 문자열 path parameter를 양의 정수로 변환합니다.
 *
 * @param value - route parameter로 받은 문자열 값
 * @returns 양의 정수이면 number, 아니면 null
 */
export function parsePositiveInteger(value: string) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

/**
 * 선택적 query parameter를 양의 정수로 변환합니다.
 *
 * @param value - query parameter 문자열 또는 null
 * @returns 값이 비어 있으면 null, 양의 정수이면 number, 유효하지 않으면 null
 */
export function parseOptionalPositiveInteger(value: string | null) {
  if (value === null || value.trim() === '') {
    return null;
  }

  return parsePositiveInteger(value);
}

/**
 * 요청 본문을 JSON 객체로 파싱하고 key를 DB 컬럼명에 맞는 snake_case로 변환합니다.
 *
 * @param request - Route Handler로 들어온 Request 객체
 * @returns 파싱에 성공하면 body, 실패하면 즉시 반환 가능한 400 응답
 */
export async function readJsonObject(
  request: Request
): Promise<{ body: JsonObject } | { response: NextResponse }> {
  try {
    const body: unknown = await request.json();

    if (!isRecord(body)) {
      return { response: badRequest('JSON 객체 본문이 필요합니다.') };
    }

    return { body: toSnakeKeys(body) as JsonObject };
  } catch {
    return { response: badRequest('올바른 JSON 본문이 필요합니다.') };
  }
}

/**
 * 필수 필드 중 요청 본문에 없거나 빈 문자열인 필드를 찾습니다.
 *
 * @param body - 검증할 JSON 객체
 * @param fields - 필수 필드 이름 목록
 * @returns 누락된 필드 이름 목록
 */
export function getMissingFields(body: JsonObject, fields: readonly string[]) {
  return fields
    .filter((field) => {
      const value = body[field];
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '')
      );
    })
    .map(snakeToCamel);
}

/**
 * 허용된 필드만 요청 본문에서 골라 새 객체로 만듭니다.
 *
 * @param body - 원본 JSON 객체
 * @param fields - 허용할 필드 이름 목록
 * @returns 허용된 필드만 포함한 새 객체
 */
export function pickBodyFields(body: JsonObject, fields: readonly string[]) {
  const payload: JsonObject = {};

  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  }

  return payload;
}

/**
 * 숫자 또는 숫자 문자열을 정수로 변환합니다.
 *
 * @param value - 정수로 변환할 값
 * @returns 정수이면 number, 아니면 null
 */
export function toInteger(value: unknown) {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return null;
  }

  return parsed;
}

/**
 * 참여자 식별용 쿠키에서 event_user_id 값을 읽습니다.
 *
 * @param request - Next.js Route Handler 요청 객체
 * @returns 쿠키에 저장된 event_user_id 또는 null
 */
export function getParticipantEventUserId(request: NextRequest) {
  return request.cookies.get(PARTICIPANT_COOKIE_NAME)?.value ?? null;
}

/**
 * 참여자 식별용 event_user_id를 HttpOnly 쿠키에 저장합니다.
 *
 * @param response - 쿠키를 설정할 NextResponse 객체
 * @param eventUserId - participant_users.event_user_id 값
 */
export function setParticipantCookie(
  response: NextResponse,
  eventUserId: string
) {
  response.cookies.set({
    name: PARTICIPANT_COOKIE_NAME,
    value: eventUserId,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

/**
 * 참여자 식별용 쿠키를 삭제합니다.
 *
 * @param response - 쿠키 삭제 헤더를 담을 NextResponse 객체
 */
export function clearParticipantCookie(response: NextResponse) {
  response.cookies.delete(PARTICIPANT_COOKIE_NAME);
}

/**
 * 요청 쿠키를 기준으로 현재 참여자 row를 조회합니다.
 *
 * @param request - Next.js Route Handler 요청 객체
 * @returns 참여자를 찾으면 participant와 eventUserId, 실패하면 즉시 반환 가능한 에러 응답
 */
export async function getCurrentParticipant(request: NextRequest): Promise<
  | {
      participant: ParticipantRow;
      eventUserId: string;
    }
  | { response: NextResponse }
> {
  const eventUserId = getParticipantEventUserId(request);

  if (!eventUserId) {
    return { response: unauthorized() };
  }

  // participant_users 테이블에서 쿠키의 event_user_id 기준 참여자 전체 컬럼 조회
  const { data, error } = await supabase
    .from('participant_users')
    .select('*')
    .eq('event_user_id', eventUserId)
    .maybeSingle();

  if (error) {
    return { response: serverError('참여자 조회 실패', error) };
  }

  if (!data) {
    const response = notFound('참여자를 찾을 수 없습니다.');
    clearParticipantCookie(response);
    return { response };
  }

  return {
    participant: data as ParticipantRow,
    eventUserId,
  };
}

/**
 * unknown 값이 배열이 아닌 일반 객체인지 확인합니다.
 *
 * @param value - 검사할 값
 * @returns 일반 객체이면 true
 */
export function isRecord(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 알 수 없는 에러 값에서 안전하게 메시지를 추출합니다.
 *
 * @param error - 메시지 속성이 있을 수 있는 에러 값
 * @returns 에러 메시지 또는 기본 메시지
 */
function getErrorMessage(error: unknown) {
  if (isRecord(error) && typeof error.message === 'string') {
    return error.message;
  }

  return 'Unknown error';
}

export async function validateEvent(eventIdParam: string): Promise<boolean> {
  const eventId = parsePositiveInteger(eventIdParam);
  if (eventId === null) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }
    return true;
  } catch (err) {
    console.error('validateEvent error:', err);
    return false;
  }
}
