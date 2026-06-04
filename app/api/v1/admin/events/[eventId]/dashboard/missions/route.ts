import dashboardMissions from "@/mocks/dashboard/missions.json";
import {
  badRequest,
  notFound,
  ok,
  parsePositiveInteger,
  serverError,
} from "@/utils/api";
import { authorizeAdminEvent } from "@/utils/admin-event-auth";
import {
  type AdminDashboardDateWindow,
  getAdminDashboardDateWindow,
} from "@/utils/admin-dashboard-date";
import { supabase } from "@/utils/supabase/server";

const MISSION_COMPLETIONS_PAGE_SIZE = 1000;

// 어드민 대시보드 미션별 완료 현황 route parameter 타입
type AdminDashboardMissionsRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

/**
 * 특정 행사의 어드민 대시보드 미션별 완료 현황을 조회합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID route parameter
 * @returns 미션별 완료 수와 완료율 데이터
 */
export async function GET(
  request: Request,
  { params }: AdminDashboardMissionsRouteContext
) {
  void request;
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest("올바른 행사 ID가 필요합니다.");
  }

  const authorization = await authorizeAdminEvent(
    eventId,
    "대시보드 미션별 완료 현황"
  );

  if ("response" in authorization) {
    return authorization.response;
  }

  if (process.env.DASHBOARD_DATA_SOURCE === "local-json") {
    return ok(dashboardMissions);
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("start_date,end_date")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    return serverError("대시보드 미션 현황 행사 기간 조회 실패", eventError);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  const dashboardDateWindow = getAdminDashboardDateWindow(
    event.start_date,
    event.end_date
  );

  let participantCountQuery = supabase
    .from("participant_users")
    .select("id", { count: "exact", head: true })
    .eq("events_id", eventId);

  if (dashboardDateWindow) {
    participantCountQuery = participantCountQuery
      .gte("created_at", dashboardDateWindow.startsAt)
      .lt("created_at", dashboardDateWindow.endsBefore);
  } else {
    participantCountQuery = participantCountQuery.lt(
      "created_at",
      "0001-01-01 00:00:00"
    );
  }

  const [
    { data: missions, error: missionsError },
    { count: participantCount, error: participantCountError },
    { data: completionMissionIds, error: completionsError },
  ] = await Promise.all([
    supabase
      .from("missions")
      .select("id,title,sort_order")
      .eq("events_id", eventId)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true }),
    participantCountQuery,
    fetchCompletionMissionIds(eventId, dashboardDateWindow),
  ]);

  if (missionsError) {
    return serverError("대시보드 미션 목록 조회 실패", missionsError);
  }

  if (participantCountError) {
    return serverError(
      "대시보드 미션 완료율 분모 조회 실패",
      participantCountError
    );
  }

  if (completionsError) {
    return serverError("대시보드 미션 완료 기록 조회 실패", completionsError);
  }

  const completionCounts = new Map<number, number>();

  for (const missionId of completionMissionIds ?? []) {
    completionCounts.set(missionId, (completionCounts.get(missionId) ?? 0) + 1);
  }

  const denominator = participantCount ?? 0;

  return ok({
    missions:
      missions?.map((mission) => {
        const completedCount = completionCounts.get(mission.id) ?? 0;

        return {
          id: mission.id,
          title: mission.title,
          completed_count: completedCount,
          completion_rate:
            denominator === 0 ? 0 : (completedCount / denominator) * 100,
        };
      }) ?? [],
  });
}

const fetchCompletionMissionIds = async (
  eventId: number,
  dashboardDateWindow: AdminDashboardDateWindow | null
) => {
  const missionIds: number[] = [];

  for (let from = 0; ; from += MISSION_COMPLETIONS_PAGE_SIZE) {
    let query = supabase
      .from("mission_completions")
      .select("missions_id")
      .eq("events_id", eventId);

    if (dashboardDateWindow) {
      query = query
        .gte("completed_at", dashboardDateWindow.startsAt)
        .lt("completed_at", dashboardDateWindow.endsBefore);
    } else {
      query = query.lt("completed_at", "0001-01-01 00:00:00");
    }

    const { data, error } = await query
      .order("id", { ascending: true })
      .range(from, from + MISSION_COMPLETIONS_PAGE_SIZE - 1);

    if (error) {
      return { data: null, error };
    }

    const rows = data ?? [];

    for (const row of rows) {
      if (typeof row.missions_id === "number") {
        missionIds.push(row.missions_id);
      }
    }

    if (rows.length < MISSION_COMPLETIONS_PAGE_SIZE) {
      return { data: missionIds, error: null };
    }
  }
};
