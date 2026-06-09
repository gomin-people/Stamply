import {
  badRequest,
  created,
  notFound,
  ok,
  parsePositiveInteger,
  serverError,
  unauthorized,
} from "@/utils/api";
import { supabase } from "@/utils/supabase/server";
import { createSessionClient } from "@/utils/supabase/session-server";
import { MissionCreateSchema } from "@/types/schemas/adminMissionSchemas";

// 행사 하위 미션 목록 route parameter 타입
type AdminEventMissionsRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

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
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest("올바른 행사 ID가 필요합니다.");
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
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    return serverError("행사 권한 확인 실패", eventError);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  // missions 테이블에서 events_id가 eventId인 미션 목록을 sort_order 오름차순 조회
  const { data, error } = await supabase
    .from("missions")
    .select(
      `
    *,
    qr_codes!inner(id, token)
  `
    )
    .eq("events_id", eventId)
    .eq("qr_codes.type", "MISSION")
    .order("sort_order", { ascending: true });

  if (error) {
    return serverError("미션 목록 조회 실패", error);
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
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest("올바른 행사 ID가 필요합니다.");
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
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    return serverError("행사 권한 확인 실패", eventError);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return badRequest("올바른 JSON 본문이 필요합니다.");
  }

  const parsed = MissionCreateSchema.safeParse(rawBody);
  if (!parsed.success) {
    return badRequest("입력값이 올바르지 않습니다.", {
      errors: parsed.error.issues[0].message,
    });
  }

  const { title, description, sortOrder, isActive } = parsed.data;

  // missions 테이블에서 events_id가 eventId인 미션 중 가장 큰 sort_order 조회
  const { data: lastMission, error: lastMissionError } = await supabase
    .from("missions")
    .select("sort_order")
    .eq("events_id", eventId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastMissionError) {
    return serverError("미션 순서 조회 실패", lastMissionError);
  }

  const now = new Date().toISOString();
  const missionPayload = {
    title,
    description,
    events_id: eventId,
    sort_order:
      sortOrder ??
      (typeof lastMission?.sort_order === "number"
        ? lastMission.sort_order + 1
        : 1),
    is_active: isActive ?? true,
    created_at: now,
    updated_at: now,
  };

  // missions 테이블에 events_id가 eventId인 미션 row 삽입 후 전체 컬럼 조회
  const { data: mission, error: missionError } = await supabase
    .from("missions")
    .insert(missionPayload)
    .select("*")
    .single();

  if (missionError) {
    return serverError("미션 생성 실패", missionError);
  }

  // qr_codes 테이블에 events_id, missions_id, type MISSION을 가진 QR row 삽입 후 조회
  const { data: qrCode, error: qrCodeError } = await supabase
    .from("qr_codes")
    .insert({
      events_id: eventId,
      missions_id: mission.id,
      type: "MISSION",
      created_at: now,
    })
    .select("*")
    .single();

  if (qrCodeError) {
    // QR 생성 실패 시 고아 미션이 남지 않도록 생성된 미션을 정리
    await supabase.from("missions").delete().eq("id", mission.id);
    return serverError("미션 QR 생성 실패", qrCodeError);
  }

  return created({
    ...mission,
    qr_code: qrCode,
  });
}
