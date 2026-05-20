'use client';

import { useMutation } from '@tanstack/react-query';
import { submitParticipantSurvey } from '@/features/participant/survey/api/participantSurveyApi';

/**
 * 참여자 설문 저장 mutation입니다.
 *
 * @returns React Query 설문 저장 mutation
 */
export function useSubmitSurveyMutation() {
  return useMutation({
    mutationFn: submitParticipantSurvey,
  });
}
