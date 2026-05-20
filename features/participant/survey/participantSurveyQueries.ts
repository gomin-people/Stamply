'use client';

import { useQuery } from '@tanstack/react-query';
import { getParticipantSurvey } from '@/features/participant/survey/api/participantSurveyApi';

/**
 * 현재 참여자의 설문 상태를 조회합니다.
 *
 * @returns React Query 참여자 설문 query
 */
export function useParticipantSurveyQuery() {
  return useQuery({
    queryKey: ['participant', 'survey'],
    queryFn: getParticipantSurvey,
  });
}
