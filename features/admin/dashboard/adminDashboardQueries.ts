"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminDashboardAchieverStatistics,
  fetchAdminDashboardKpis,
  fetchAdminDashboardMissions,
  fetchAdminDashboardParticipantAnalysis,
} from "./adminDashboardApi";
import { adminDashboardQueryKeys } from "@/constants/adminDashboardQueryKeys";

const DASHBOARD_QUERY_STALE_TIME = 60000;

/**
 * 어드민 대시보드 KPI 카드 데이터를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query KPI 카드 데이터
 */
export function useAdminDashboardKpisQuery(eventId: number | null | undefined) {
  return useQuery({
    queryKey: adminDashboardQueryKeys.kpis(eventId),
    queryFn: () => fetchAdminDashboardKpis(eventId as number),
    enabled: isValidEventId(eventId),
    staleTime: DASHBOARD_QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

/**
 * 어드민 대시보드 참여자 수 분석 데이터를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 참여자 수 분석 데이터
 */
export function useAdminDashboardParticipantAnalysisQuery(
  eventId: number | null | undefined
) {
  return useQuery({
    queryKey: adminDashboardQueryKeys.participantAnalysis(eventId),
    queryFn: () => fetchAdminDashboardParticipantAnalysis(eventId as number),
    enabled: isValidEventId(eventId),
    staleTime: DASHBOARD_QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

/**
 * 어드민 대시보드 달성자 통계 데이터를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 달성자 통계 데이터
 */
export function useAdminDashboardAchieverStatisticsQuery(
  eventId: number | null | undefined
) {
  return useQuery({
    queryKey: adminDashboardQueryKeys.achieverStatistics(eventId),
    queryFn: () => fetchAdminDashboardAchieverStatistics(eventId as number),
    enabled: isValidEventId(eventId),
    staleTime: DASHBOARD_QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

/**
 * 어드민 대시보드 미션별 완료 현황을 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 미션별 완료 현황 데이터
 */
export function useAdminDashboardMissionsQuery(
  eventId: number | null | undefined
) {
  return useQuery({
    queryKey: adminDashboardQueryKeys.missions(eventId),
    queryFn: () => fetchAdminDashboardMissions(eventId as number),
    enabled: isValidEventId(eventId),
    staleTime: DASHBOARD_QUERY_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

function isValidEventId(eventId: number | null | undefined): eventId is number {
  return typeof eventId === "number" && eventId > 0;
}
