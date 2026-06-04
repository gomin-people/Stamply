import { badRequest, ok, parsePositiveInteger, serverError } from "@/utils/api";
import { authorizeAdminEvent } from "@/utils/admin-event-auth";
import { supabase } from "@/utils/supabase/server";

// 어드민 대시보드 KPI route parameter 타입
type AdminDashboardKpisRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

/**
 * 특정 행사의 어드민 대시보드 KPI 카드 데이터를 조회합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID route parameter
 * @returns KPI 카드 4개 데이터
 */
export async function GET(
  request: Request,
  { params }: AdminDashboardKpisRouteContext
) {
  void request;
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest("올바른 행사 ID가 필요합니다.");
  }

  const authorization = await authorizeAdminEvent(eventId, "대시보드 KPI");

  if ("response" in authorization) {
    return authorization.response;
  }

  const { data, error } = await supabase.rpc("get_admin_dashboard_kpis", {
    p_event_id: eventId,
  });

  if (error) {
    return serverError("대시보드 KPI 집계 조회 실패", error);
  }

  return ok(data);
}
