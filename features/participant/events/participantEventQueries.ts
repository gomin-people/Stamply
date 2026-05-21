'use client';

import { useQuery } from '@tanstack/react-query';
import { getParticipantEvent } from '@/features/participant/events/api/participantEventsApi';

/**
 * 현재 참여자가 입장한 행사를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 참여자 행사 query
 */
export function useParticipantEventQuery(
  eventId: number | null | undefined
) {
  return useQuery({
    queryKey: ['participant', 'events', 'detail', eventId],
    queryFn: () => getParticipantEvent(eventId as number),
    enabled: typeof eventId === 'number' && eventId > 0,
  });
}
