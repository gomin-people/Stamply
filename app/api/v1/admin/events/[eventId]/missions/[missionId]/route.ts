import {
  badRequest,
  notFound,
  ok,
  parsePositiveInteger,
  pickBodyFields,
  readJsonObject,
  serverError,
  toInteger,
  unauthorized,
} from "@/utils/api";
import { supabase } from "@/utils/supabase/server";
import { createSessionClient } from "@/utils/supabase/session-server";

// 행사 하위 단일 미션 route parameter 타입
type AdminEventMissionRouteContext = {
  params: Promise<{
    eventId: string;
    missionId: string;
  }>;
};

// 미션 수정 시 요청 본문에서 허용하는 필드 목록
const MISSION_UPDATE_FIELDS = [
  "title",
  "description",
  "sort_order",
  "is_active",
] as const;

/**
 * 단일 미션 상세와 연결된 MISSION QR을 조회합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID와 미션 ID route parameter
 * @returns 미션 상세와 QR 정보
 */
export async function GET(
  request: Request,
  { params }: AdminEventMissionRouteContext
) {
  void request;
  const parsedParams = await parseMissionParams(params);

  if ("response" in parsedParams) {
    return parsedParams.response;
  }

  const sessionSupabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await sessionSupabase.auth.getUser();

  if (userError || !user) {
    return unauthorized("인증되지 않은 사용자입니다.");
  }

  // events 테이블은 RLS로 현재 운영자 소유 row만 조회됩니다.
  const { data: event, error: eventError } = await sessionSupabase
    .from("events")
    .select("id")
    .eq("id", parsedParams.eventId)
    .maybeSingle();

  if (eventError) {
    return serverError("행사 권한 확인 실패", eventError);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  // missions 테이블에서 id가 missionId이고 events_id가 eventId인 미션 전체 컬럼 조회
  const { data: mission, error: missionError } = await supabase
    .from("missions")
    .select("*")
    .eq("id", parsedParams.missionId)
    .eq("events_id", parsedParams.eventId)
    .maybeSingle();

  if (missionError) {
    return serverError("미션 상세 조회 실패", missionError);
  }

  if (!mission) {
    return notFound("미션을 찾을 수 없습니다.");
  }

  // qr_codes 테이블에서 events_id, missions_id, type MISSION 기준 QR 조회
  const { data: qrCode, error: qrCodeError } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("events_id", parsedParams.eventId)
    .eq("missions_id", parsedParams.missionId)
    .eq("type", "MISSION")
    .maybeSingle();

  if (qrCodeError) {
    return serverError("미션 QR 조회 실패", qrCodeError);
  }

  return ok({
    ...mission,
    qr_code: qrCode,
  });
}

/**
 * 단일 미션 정보를 부분 수정합니다.
 *
 * @param request - 수정할 미션 필드를 담은 JSON 본문
 * @param context - 행사 ID와 미션 ID route parameter
 * @returns 수정된 미션 row
 */
export async function PATCH(
  request: Request,
  { params }: AdminEventMissionRouteContext
) {
  const parsedParams = await parseMissionParams(params);

  if ("response" in parsedParams) {
    return parsedParams.response;
  }

  const sessionSupabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await sessionSupabase.auth.getUser();

  if (userError || !user) {
    return unauthorized("인증되지 않은 사용자입니다.");
  }

  // events 테이블은 RLS로 현재 운영자 소유 row만 조회됩니다.
  const { data: event, error: eventError } = await sessionSupabase
    .from("events")
    .select("id")
    .eq("id", parsedParams.eventId)
    .maybeSingle();

  if (eventError) {
    return serverError("행사 권한 확인 실패", eventError);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  const result = await readJsonObject(request);

  if ("response" in result) {
    return result.response;
  }

  // 프론트에서 camelCase로 전달된 필드명을 DB 필드명으로 정규화
  const body = result.body;
  if ("isActive" in body) {
    body.is_active = body.isActive;
    delete body.isActive;
  }

  if ("sortOrder" in body) {
    body.sort_order = body.sortOrder;
    delete body.sortOrder;
  }

  const payload = pickBodyFields(body, MISSION_UPDATE_FIELDS);

  if (Object.keys(payload).length === 0) {
    return badRequest("수정할 미션 필드가 필요합니다.");
  }

  if (Object.prototype.hasOwnProperty.call(payload, "sort_order")) {
    const sortOrder = toInteger(payload.sort_order);

    if (sortOrder === null) {
      return badRequest("sortOrder는 정수여야 합니다.");
    }

    payload.sort_order = sortOrder;
  }

  if (
    Object.prototype.hasOwnProperty.call(payload, "is_active") &&
    typeof payload.is_active !== "boolean"
  ) {
    return badRequest("isActive는 boolean이어야 합니다.");
  }

  // missions 테이블에서 id가 missionId이고 events_id가 eventId인 row 수정 후 조회
  const { data, error } = await supabase
    .from("missions")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsedParams.missionId)
    .eq("events_id", parsedParams.eventId)
    .select("*")
    .maybeSingle();

  if (error) {
    return serverError("미션 수정 실패", error);
  }

  if (!data) {
    return notFound("미션을 찾을 수 없습니다.");
  }

  return ok(data);
}

/**
 * 단일 미션과 연결된 완료 기록, QR을 삭제합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID와 미션 ID route parameter
 * @returns 삭제된 미션 ID
 */
export async function DELETE(
  request: Request,
  { params }: AdminEventMissionRouteContext
) {
  void request;
  const parsedParams = await parseMissionParams(params);

  if ("response" in parsedParams) {
    return parsedParams.response;
  }

  const sessionSupabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await sessionSupabase.auth.getUser();

  if (userError || !user) {
    return unauthorized("인증되지 않은 사용자입니다.");
  }

  // events 테이블은 RLS로 현재 운영자 소유 row만 조회됩니다.
  const { data: event, error: eventError } = await sessionSupabase
    .from("events")
    .select("id")
    .eq("id", parsedParams.eventId)
    .maybeSingle();

  if (eventError) {
    return serverError("행사 권한 확인 실패", eventError);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  // missions 테이블에서 id가 missionId이고 events_id가 eventId인 삭제 대상 row 조회
  const { data: mission, error: missionError } = await supabase
    .from("missions")
    .select("id")
    .eq("id", parsedParams.missionId)
    .eq("events_id", parsedParams.eventId)
    .maybeSingle();

  if (missionError) {
    return serverError("미션 삭제 대상 조회 실패", missionError);
  }

  if (!mission) {
    return notFound("미션을 찾을 수 없습니다.");
  }

  // 미션 삭제 전 완료 기록과 QR을 먼저 정리
  const cleanupSteps = [
    // mission_completions 테이블에서 events_id와 missions_id 기준 완료 기록 삭제
    supabase
      .from("mission_completions")
      .delete()
      .eq("events_id", parsedParams.eventId)
      .eq("missions_id", parsedParams.missionId),
    // qr_codes 테이블에서 events_id와 missions_id 기준 QR 코드 삭제
    supabase
      .from("qr_codes")
      .delete()
      .eq("events_id", parsedParams.eventId)
      .eq("missions_id", parsedParams.missionId),
  ];

  for (const step of cleanupSteps) {
    const { error } = await step;

    if (error) {
      return serverError("미션 연관 데이터 삭제 실패", error);
    }
  }

  // missions 테이블에서 id가 missionId이고 events_id가 eventId인 미션 row 삭제
  const { error: deleteMissionError } = await supabase
    .from("missions")
    .delete()
    .eq("id", parsedParams.missionId)
    .eq("events_id", parsedParams.eventId);

  if (deleteMissionError) {
    return serverError("미션 삭제 실패", deleteMissionError);
  }

  return ok({
    id: parsedParams.missionId,
  });
}

/**
 * 행사 ID와 미션 ID route parameter를 양의 정수로 검증합니다.
 *
 * @param params - Next.js 동적 route parameter Promise
 * @returns 검증된 eventId/missionId 또는 즉시 반환 가능한 400 응답
 */
async function parseMissionParams(
  params: AdminEventMissionRouteContext["params"]
) {
  const { eventId: eventIdParam, missionId: missionIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);
  const missionId = parsePositiveInteger(missionIdParam);

  if (eventId === null) {
    return { response: badRequest("올바른 행사 ID가 필요합니다.") };
  }

  if (missionId === null) {
    return { response: badRequest("올바른 미션 ID가 필요합니다.") };
  }

  return {
    eventId,
    missionId,
  };
}
