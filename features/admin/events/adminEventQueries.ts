'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getAdminEvent,
  getAdminEvents,
  getEventDashboard,
} from '@/features/admin/events/api/adminEventsApi';

/**
 * 어드민 행사 목록을 조회합니다.
 *
 * @param userId - 선택적으로 필터링할 운영자 ID
 * @returns React Query 어드민 행사 목록 query
 */
export function useAdminEventsQuery(userId?: number) {
  return useQuery({
    queryKey: ['admin', 'events', 'list', userId],
    queryFn: () => getAdminEvents(userId),
  });
}

/**
 * 어드민 행사 상세를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 어드민 행사 상세 query
 */
export function useAdminEventQuery(eventId: number | null | undefined) {
  return useQuery({
    queryKey: ['admin', 'events', 'detail', eventId],
    queryFn: () => getAdminEvent(eventId as number),
    enabled: typeof eventId === 'number' && eventId > 0,
  });
}

/**
 * 어드민 행사 대시보드 데이터를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 대시보드 query
 */
export function useEventDashboardQuery(
  eventId: number | null | undefined
) {
  return useQuery({
    queryKey: ['admin', 'events', 'dashboard', eventId],
    queryFn: () => getEventDashboard(eventId as number),
    enabled: typeof eventId === 'number' && eventId > 0,
  });
}
