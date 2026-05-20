'use client';

import { useQuery } from '@tanstack/react-query';
import { getParticipantMissions } from '@/features/participant/missions/api/participantMissionsApi';

/**
 * 현재 참여자의 미션 진행 상태를 조회합니다.
 *
 * @returns React Query 참여자 미션 진행 query
 */
export function useParticipantMissionsQuery() {
  return useQuery({
    queryKey: ['participant', 'missions'],
    queryFn: getParticipantMissions,
  });
}
