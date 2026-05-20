import { requestJson } from '@/features/shared/api/http';
import { type StamplyEvent } from '@/features/shared/types/stamply';

/**
 * 쿠키 기준 현재 참여자가 입장한 행사를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns 현재 참여자가 입장한 행사 정보
 */
export function getParticipantEvent(eventId: number) {
  return requestJson<StamplyEvent>(`/api/v1/participant/events/${eventId}`);
}
