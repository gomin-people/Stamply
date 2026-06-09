import { type NextRequest } from "next/server";
import { conflict, getCurrentParticipant, ok } from "@/utils/api";

/**
 * 현재 참여자의 REWARD QR 발급에 필요한 식별 값을 반환합니다.
 * 리워드를 이미 수령한 참여자는 409를 반환합니다.
 *
 * @param request - 참여자 식별 쿠키를 포함한 요청 객체
 * @returns 참여자 REWARD QR 식별 값 (eventUserId, eventsId)
 */
export async function POST(request: NextRequest) {
  const participantResult = await getCurrentParticipant(request);

  if ("response" in participantResult) {
    return participantResult.response;
  }

  const { participant, eventUserId } = participantResult;

  if (participant.is_reward_claimed) {
    return conflict("이미 리워드를 수령한 참여자입니다.");
  }

  // QR value로 사용할 event_user_id를 반환한다.
  // 어드민 스캔 시 이 값으로 participant_users 테이블에서 참여자를 특정한다.
  return ok({
    eventUserId,
    eventsId: participant.events_id,
  });
}
