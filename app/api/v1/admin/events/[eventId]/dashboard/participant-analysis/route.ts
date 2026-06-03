import { NextResponse } from "next/server";
import participantAnalysisData from "@/mocks/dashboard/participant-analysis.json";
import { badRequest, ok, parsePositiveInteger } from "@/utils/api";
import { authorizeAdminEvent } from "@/utils/admin-event-auth";

// 어드민 대시보드 참여자 수 분석 route parameter 타입
type AdminDashboardParticipantAnalysisRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

/**
 * 특정 행사의 어드민 대시보드 참여자 수 분석 데이터를 조회합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID route parameter
 * @returns 날짜별, 시간대별 참여자 수 데이터
 */
export async function GET(
  request: Request,
  { params }: AdminDashboardParticipantAnalysisRouteContext
) {
  void request;
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest("올바른 행사 ID가 필요합니다.");
  }

  const authorization = await authorizeAdminEvent(
    eventId,
    "대시보드 참여자 수 분석"
  );

  if ("response" in authorization) {
    return authorization.response;
  }

  if (process.env.DASHBOARD_DATA_SOURCE === "local-json") {
    return ok(participantAnalysisData);
  }

  return NextResponse.json(
    {
      message:
        "대시보드 참여자 수 분석 Supabase 집계는 5번 단계에서 구현합니다.",
    },
    { status: 501 }
  );
}
