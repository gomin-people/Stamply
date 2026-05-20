'use client';

import { useQuery } from '@tanstack/react-query';
import { getParticipant } from '@/features/participant/api/participantApi';

/**
 * 현재 참여자 상태를 조회합니다.
 *
 * @returns React Query 참여자 상태 query
 */
export function useParticipantQuery() {
  return useQuery({
    queryKey: ['participant', 'state'],
    queryFn: getParticipant,
  });
}
