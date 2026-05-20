import { requestJson } from '@/features/shared/api/http';
import {
  type Participant,
  type QrCode,
  type StamplyEvent,
} from '@/features/shared/types/stamply';

// 입장 QR 처리 응답 타입
export type EntryResult = {
  event: StamplyEvent;
  participant: Participant;
  qr_code: QrCode;
};

/**
 * ENTRY QR 토큰으로 행사 참여를 시작합니다.
 *
 * @param token - ENTRY QR token
 * @param userId - 선택적으로 연결할 외부 사용자 ID
 * @returns 행사, 참여자, QR 정보
 */
export function enterEventByToken(token: string, userId?: number) {
  const searchParams = new URLSearchParams();

  if (userId !== undefined) {
    searchParams.set('userId', String(userId));
  }

  const queryString = searchParams.toString();
  const path =
    queryString.length > 0
      ? `/api/v1/qr/entry/${token}?${queryString}`
      : `/api/v1/qr/entry/${token}`;

  return requestJson<EntryResult>(path);
}
