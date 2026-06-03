import {
  badRequest,
  notFound,
  ok,
  parsePositiveInteger,
  readJsonObject,
  serverError,
  unauthorized,
} from "@/utils/api";
import { supabase } from "@/utils/supabase/server";
import { createSessionClient } from "@/utils/supabase/session-server";

type AdminEventMissionsReorderRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

/**
 * 특정 행사의 미션 순서를 일괄 변경합니다.
 * missionIds 배열의 순서가 새로운 sort_order가 됩니다.
 *
 * @param request - { missionIds: number[] } JSON 본문
 * @param context - 행사 ID route parameter
 * @returns 변경된 미션 ID 목록
 */
export async function PUT(
  request: Request,
  { params }: AdminEventMissionsReorderRouteContext
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

  const result = await readJsonObject(request);

  if ("response" in result) {
    return result.response;
  }

  // readJsonObject가 toSnakeKeys를 적용하므로 mission_ids로 접근
  const missionIds = result.body.mission_ids;

  if (
    !Array.isArray(missionIds) ||
    missionIds.length === 0 ||
    missionIds.some(
      (id) => typeof id !== "number" || !Number.isInteger(id) || id <= 0
    )
  ) {
    return badRequest("missionIds는 양의 정수 배열이어야 합니다.");
  }

  // 요청된 미션들이 모두 이 행사에 속하는지 검증
  const { data: existingMissions, error: fetchError } = await supabase
    .from("missions")
    .select("id")
    .eq("events_id", eventId)
    .in("id", missionIds);

  if (fetchError) {
    return serverError("미션 목록 조회 실패", fetchError);
  }

  if (existingMissions.length !== missionIds.length) {
    return badRequest("일부 미션이 해당 행사에 존재하지 않습니다.");
  }

  // missionIds 배열 순서를 sort_order(1-based)로 개별 update 병렬 실행
  const now = new Date().toISOString();
  const results = await Promise.all(
    missionIds.map((id, index) =>
      supabase
        .from("missions")
        .update({ sort_order: index + 1, updated_at: now })
        .eq("id", id)
        .eq("events_id", eventId)
    )
  );

  const failed = results.find(({ error }) => error);
  if (failed?.error) {
    return serverError("미션 순서 변경 실패", failed.error);
  }

  return ok({ missionIds });
}
