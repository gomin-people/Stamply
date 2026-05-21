import { requestJson } from '@/features/shared/api/http';
import { type Participant } from '@/features/shared/types/stamply';

// 현재 참여자 조회 응답 타입
export type ParticipantState = {
  participant: Participant;
};

/**
 * 쿠키 기준 현재 참여자 상태를 조회합니다.
 *
 * @returns 현재 참여자 정보
 */
export function getParticipant() {
  return requestJson<ParticipantState>('/api/v1/participant');
}
