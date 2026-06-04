import { badRequest, ok, parsePositiveInteger, serverError } from "@/utils/api";
import { authorizeAdminEvent } from "@/utils/admin-event-auth";
import { supabase } from "@/utils/supabase/server";

// 어드민 대시보드 달성자 통계 route parameter 타입
type AdminDashboardAchieverStatisticsRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

/**
 * 특정 행사의 어드민 대시보드 달성자 통계 데이터를 조회합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID route parameter
 * @returns 달성자 성별, 연령대 통계 데이터
 */
export async function GET(
  request: Request,
  { params }: AdminDashboardAchieverStatisticsRouteContext
) {
  void request;
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest("올바른 행사 ID가 필요합니다.");
  }

  const authorization = await authorizeAdminEvent(
    eventId,
    "대시보드 달성자 통계"
  );

  if ("response" in authorization) {
    return authorization.response;
  }

  const { data, error } = await supabase
    .from("admin_dashboard_achiever_statistics")
    .select("total_achievers, total_respondents, gender, age_range")
    .eq("events_id", eventId)
    .maybeSingle();

  if (error) {
    return serverError("대시보드 달성자 통계 조회 실패", error);
  }

  return ok(
    data ?? {
      total_achievers: 0,
      total_respondents: 0,
      gender: [],
      age_range: [],
    }
  );
}
