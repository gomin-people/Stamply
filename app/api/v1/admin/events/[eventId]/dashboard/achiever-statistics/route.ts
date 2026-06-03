import { NextResponse } from "next/server";
import achieverStatisticsData from "@/mocks/dashboard/achiever-statistics.json";
import { badRequest, ok, parsePositiveInteger } from "@/utils/api";
import { authorizeAdminEvent } from "@/utils/admin-event-auth";

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

  if (process.env.DASHBOARD_DATA_SOURCE === "local-json") {
    return ok(achieverStatisticsData);
  }

  return NextResponse.json(
    {
      message: "대시보드 달성자 통계 Supabase 집계는 5번 단계에서 구현합니다.",
    },
    { status: 501 }
  );
}
