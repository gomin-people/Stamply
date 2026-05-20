import { createJsonRequest, requestJson } from '@/features/shared/api/http';
import {
  type Participant,
  type SurveyPayload,
} from '@/features/shared/types/stamply';

// 참여자 설문 상태 응답 타입
export type ParticipantSurvey = Pick<
  Participant,
  'gender' | 'age_range' | 'is_reward_claimed'
>;

/**
 * 쿠키 기준 현재 참여자의 설문 상태를 조회합니다.
 *
 * @returns 설문 응답 상태
 */
export function getParticipantSurvey() {
  return requestJson<ParticipantSurvey>('/api/v1/participant/survey');
}

/**
 * 쿠키 기준 현재 참여자의 설문 응답을 저장합니다.
 *
 * @param payload - 설문 저장 요청 값
 * @returns 수정된 참여자 row
 */
export function submitParticipantSurvey(payload: SurveyPayload) {
  return requestJson<Participant>(
    '/api/v1/participant/survey',
    createJsonRequest('POST', payload)
  );
}
