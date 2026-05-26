'use client';

import { useQuery } from '@tanstack/react-query';
import { requestJson } from '@/features/shared/api/http';
import {
  type Mission,
  type QrCode,
} from '@/features/shared/types/stamply';

// 미션 상세 응답 타입
type AdminMissionDetail = Mission & {
  qrCode: QrCode | null;
};

function getAdminEventMissions(eventId: number) {
  return requestJson<Mission[]>(`/api/v1/admin/events/${eventId}/missions`);
}

function getAdminEventMission(eventId: number, missionId: number) {
  return requestJson<AdminMissionDetail>(
    `/api/v1/admin/events/${eventId}/missions/${missionId}`
  );
}

/**
 * 어드민 미션 목록을 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 미션 목록
 */
export function useAdminMissionsQuery(eventId: number | null | undefined) {
  return useQuery({
    queryKey: ['admin', 'events', eventId, 'missions'],
    queryFn: () => getAdminEventMissions(eventId as number),
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
export function useAdminMissionQuery(
  eventId: number | null | undefined,
  missionId: number | null | undefined
) {
  return useQuery({
    queryKey: ['admin', 'events', eventId, 'missions', missionId],
    queryFn: () =>
      getAdminEventMission(eventId as number, missionId as number),
    enabled:
      typeof eventId === 'number' &&
      eventId > 0 &&
      typeof missionId === 'number' &&
      missionId > 0,
  });
}
