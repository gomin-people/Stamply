"use client";

import { useQuery } from "@tanstack/react-query";
import { requestJson } from "@/features/shared/api/http";
import {
  type Mission,
  type QrCode,
  type StamplyEvent,
} from "@/features/shared/types/stamply";

// 어드민 행사 상세 응답 타입
type AdminEventDetail = StamplyEvent & {
  missions: Mission[];
  qrCodes: QrCode[];
  participantCount: number;
};

// 행사 대시보드 응답 타입
type EventDashboard = {
  event: StamplyEvent;
  summary: {
    missionCount: number;
    activeMissionCount: number;
    participantCount: number;
    completionCount: number;
    rewardClaimedCount: number;
    completionRate: number;
  };
  missions: Array<
    Pick<Mission, "id" | "title" | "sortOrder" | "isActive"> & {
      completedCount: number;
    }
  >;
};

function getAdminEvents(userId?: string) {
  const searchParams = new URLSearchParams();

  if (userId !== undefined) {
    searchParams.set("userId", String(userId));
  }

  const queryString = searchParams.toString();
  const path =
    queryString.length > 0
      ? `/api/v1/admin/events?${queryString}`
      : "/api/v1/admin/events";

  return requestJson<StamplyEvent[]>(path);
}

function getAdminEvent(eventId: number) {
  return requestJson<AdminEventDetail>(`/api/v1/admin/events/${eventId}`);
}

function getEventDashboard(eventId: number) {
  return requestJson<EventDashboard>(
    `/api/v1/admin/events/${eventId}/dashboard`
  );
}

/**
 * 어드민 행사 목록을 조회합니다.
 *
 * @param userId - 선택적으로 필터링할 운영자 ID
 * @returns React Query 어드민 행사 목록
 */
export function useAdminEventsQuery(userId?: string) {
  return useQuery({
    queryKey: ["admin", "events", "list", userId],
    queryFn: () => getAdminEvents(userId),
  });
}

/**
 * 어드민 행사 상세를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 어드민 행사 상세
 */
export function useAdminEventQuery(eventId: number | null | undefined) {
  return useQuery({
    queryKey: ["admin", "events", "detail", eventId],
    queryFn: () => getAdminEvent(eventId as number),
    enabled: typeof eventId === "number" && eventId > 0,
  });
}

/**
 * 어드민 행사 대시보드 데이터를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 대시보드
 */
export function useEventDashboardQuery(eventId: number | null | undefined) {
  return useQuery({
    queryKey: ["admin", "events", "dashboard", eventId],
    queryFn: () => getEventDashboard(eventId as number),
    enabled: typeof eventId === "number" && eventId > 0,
  });
}
