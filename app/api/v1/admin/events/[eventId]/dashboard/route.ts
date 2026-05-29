import {
  badRequest,
  notFound,
  ok,
  parsePositiveInteger,
  serverError,
  unauthorized,
} from "@/utils/api";
import { supabase } from "@/utils/supabase/server";
import { createSessionClient } from "@/utils/supabase/session-server";

// 어드민 대시보드 route parameter 타입
type AdminEventDashboardRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

/**
 * 특정 행사의 어드민 대시보드 집계 데이터를 조회합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID route parameter
 * @returns 행사 정보, 요약 지표, 미션별 완료 수
 */
export async function GET(
  request: Request,
  { params }: AdminEventDashboardRouteContext
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
    .select("*")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    return serverError("대시보드 행사 조회 실패", eventError);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  // 대시보드 카드와 미션별 현황에 필요한 집계 원천 데이터를 병렬 조회
  const [
    { data: missions, error: missionsError },
    { count: participantCount, error: participantCountError },
    { count: rewardClaimedCount, error: rewardClaimedCountError },
    { data: completions, error: completionsError },
  ] = await Promise.all([
    // missions 테이블에서 events_id가 eventId인 미션 id, title, sort_order, is_active 조회
    supabase
      .from("missions")
      .select("id,title,sort_order,is_active")
      .eq("events_id", eventId)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true }),
    // participant_users 테이블에서 events_id가 eventId인 참여자 수 조회
    supabase
      .from("participant_users")
      .select("id", { count: "exact", head: true })
      .eq("events_id", eventId),
    // participant_users 테이블에서 events_id와 is_reward_claimed 기준 리워드 수령자 수 조회
    supabase
      .from("participant_users")
      .select("id", { count: "exact", head: true })
      .eq("events_id", eventId)
      .eq("is_reward_claimed", true),
    // mission_completions 테이블에서 events_id가 eventId인 완료 기록의 missions_id 조회
    supabase
      .from("mission_completions")
      .select("missions_id")
      .eq("events_id", eventId),
  ]);

  if (missionsError) {
    return serverError("대시보드 미션 조회 실패", missionsError);
  }

  if (participantCountError) {
    return serverError("대시보드 참여자 수 조회 실패", participantCountError);
  }

  if (rewardClaimedCountError) {
    return serverError(
      "대시보드 리워드 수령 수 조회 실패",
      rewardClaimedCountError
    );
  }

  if (completionsError) {
    return serverError("대시보드 미션 완료 조회 실패", completionsError);
  }

  const completionCounts = new Map<number, number>();

  // 미션별 완료 수는 mission_completions를 missions_id 기준으로 묶어 계산
  for (const completion of completions ?? []) {
    const missionId = completion.missions_id;

    if (typeof missionId === "number") {
      completionCounts.set(
        missionId,
        (completionCounts.get(missionId) ?? 0) + 1
      );
    }
  }

  const activeMissionCount =
    missions?.filter((mission) => mission.is_active).length ?? 0;
  // 완료율 분모는 참여자 수와 활성 미션 수를 기준으로 계산
  const totalPossibleCompletions = (participantCount ?? 0) * activeMissionCount;
  const totalCompletions = completions?.length ?? 0;

  return ok({
    event,
    summary: {
      mission_count: missions?.length ?? 0,
      active_mission_count: activeMissionCount,
      participant_count: participantCount ?? 0,
      completion_count: totalCompletions,
      reward_claimed_count: rewardClaimedCount ?? 0,
      completion_rate:
        totalPossibleCompletions === 0
          ? 0
          : totalCompletions / totalPossibleCompletions,
    },
    missions:
      missions?.map((mission) => ({
        ...mission,
        completed_count: completionCounts.get(mission.id) ?? 0,
      })) ?? [],
  });
}
