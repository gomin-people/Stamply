'use client';

import { useQuery } from '@tanstack/react-query';
import { requestJson } from '@/features/shared/api/http';
import type { AdminMissionDetail } from '@/types/models/admin';

/**
 * 어드민 미션 목록을 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 미션 목록
 */
export function useAdminMissionsQuery(eventId: number) {
  return useQuery({
    queryKey: ['admin', 'events', eventId, 'missions'],
    queryFn: () =>
      requestJson<AdminMissionDetail[]>(
        `/api/v1/admin/events/${eventId}/missions`
      ),
    enabled: typeof eventId === 'number' && eventId > 0,
  });
}

/**
 * 어드민 미션 상세를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @param missionId - 미션 ID
 * @returns React Query 미션 상세
 */
export function useAdminMissionQuery(eventId: number, missionId: number) {
  return useQuery({
    queryKey: ['admin', 'events', eventId, 'missions', missionId],
    queryFn: () =>
      requestJson<AdminMissionDetail>(
        `/api/v1/admin/events/${eventId}/missions/${missionId}`
      ),
    enabled:
      typeof eventId === 'number' &&
      eventId > 0 &&
      typeof missionId === 'number' &&
      missionId > 0,
  });
}
