import { type NextRequest } from 'next/server';
import { getCurrentParticipant, ok } from '@/utils/api';

/**
 * 쿠키 기준 현재 참여자를 조회합니다.
 *
 * @param request - 참여자 식별 쿠키를 포함한 요청 객체
 * @returns 현재 참여자 정보
 */
export async function GET(request: NextRequest) {
  const result = await getCurrentParticipant(request);

  if ('response' in result) {
    return result.response;
  }

  return ok({
    participant: result.participant,
  });
}
