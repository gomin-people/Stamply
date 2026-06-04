import { requestJson, resolveRequest } from "@/features/shared/api/http";
import type {
  AdminDashboardAchieverStatisticsResponse,
  AdminDashboardKpisResponse,
  AdminDashboardMissionsResponse,
  AdminDashboardParticipantAnalysisResponse,
} from "@/types/admin-dashboard";

/**
 * 어드민 대시보드 KPI 카드 데이터를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns KPI 카드 4개 데이터
 */
export async function fetchAdminDashboardKpis(
  eventId: number
): Promise<AdminDashboardKpisResponse> {
  const { url, init } = await resolveRequest(
    `/api/v1/admin/events/${eventId}/dashboard/kpis`
  );
  return requestJson<AdminDashboardKpisResponse>(url, init);
}

/**
 * 어드민 대시보드 참여자 수 분석 데이터를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns 날짜별, 시간대별 참여자 수 데이터
 */
export async function fetchAdminDashboardParticipantAnalysis(
  eventId: number
): Promise<AdminDashboardParticipantAnalysisResponse> {
  const { url, init } = await resolveRequest(
    `/api/v1/admin/events/${eventId}/dashboard/participant-analysis`
  );
  return requestJson<AdminDashboardParticipantAnalysisResponse>(url, init);
}

/**
 * 어드민 대시보드 달성자 통계 데이터를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns 달성자 성별, 연령대 통계 데이터
 */
export async function fetchAdminDashboardAchieverStatistics(
  eventId: number
): Promise<AdminDashboardAchieverStatisticsResponse> {
  const { url, init } = await resolveRequest(
    `/api/v1/admin/events/${eventId}/dashboard/achiever-statistics`
  );
  return requestJson<AdminDashboardAchieverStatisticsResponse>(url, init);
}

/**
 * 어드민 대시보드 미션별 완료 현황을 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns 미션별 완료 수와 완료율 데이터
 */
export async function fetchAdminDashboardMissions(
  eventId: number
): Promise<AdminDashboardMissionsResponse> {
  const { url, init } = await resolveRequest(
    `/api/v1/admin/events/${eventId}/dashboard/missions`
  );
  return requestJson<AdminDashboardMissionsResponse>(url, init);
}
