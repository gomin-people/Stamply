import { type NextRequest } from "next/server";
import {
  badRequest,
  conflict,
  getParticipantEventUserId,
  notFound,
  ok,
  serverError,
  unauthorized,
} from "@/utils/api";
import { supabase } from "@/utils/supabase/server";

/**
 * 현재 참여자의 REWARD QR 발급에 필요한 식별 값을 반환합니다.
 * 리워드를 이미 수령한 참여자는 409를 반환합니다.
 *
 * @param request - 참여자 식별 쿠키를 포함한 요청 객체
 * @returns 참여자 REWARD QR 식별 값 (eventUserId, eventsId)
 */
export async function POST(request: NextRequest) {
  const eventUserId = getParticipantEventUserId(request);

  if (!eventUserId) {
    return unauthorized();
  }

  // 1. 참여자 정보, 이벤트 정보, 활성 미션 목록, 미션 완료 기록 목록을 단일 조인 쿼리로 통합 조회
  const { data: participant, error: participantError } = await supabase
    .from("participant_users")
    .select(
      `
      *,
      events (
        id,
        missions (
          id,
          is_active
        )
      ),
      mission_completions (
        missions_id
      )
    `
    )
    .eq("event_user_id", eventUserId)
    .maybeSingle();

  if (participantError) {
    return serverError("참여자 조회 실패", participantError);
  }

  if (!participant) {
    return notFound("참여자를 찾을 수 없습니다.");
  }

  if (participant.is_reward_claimed) {
    return conflict("이미 리워드를 수령한 참여자입니다.");
  }

  // 2. 자바스크립트 레벨에서 활성 미션 개수 필터링
  const rawEvents = participant.events;
  const eventData = Array.isArray(rawEvents) ? rawEvents[0] : rawEvents;
  const missions = eventData?.missions ?? [];
  const activeMissions = Array.isArray(missions)
    ? missions.filter((m: { id: number; is_active: boolean }) => m.is_active)
    : [];
  const activeMissionsCount = activeMissions.length;

  // 3. 자바스크립트 레벨에서 완료 미션 기록 개수 계산
  const completions = participant.mission_completions ?? [];
  const completedMissionsCount = Array.isArray(completions)
    ? completions.length
    : 0;

  // 4. 미션 완료 여부 검증 (활성화된 미션이 최소 1개 이상 존재하고, 모두 완료했는지 확인)
  if (
    activeMissionsCount === 0 ||
    completedMissionsCount < activeMissionsCount
  ) {
    return badRequest("모든 필수 미션을 완료하지 않았습니다.");
  }

  // QR value로 사용할 event_user_id를 반환한다.
  // 어드민 스캔 시 이 값으로 participant_users 테이블에서 참여자를 특정한다.
  return ok({
    eventUserId,
    eventsId: participant.events_id,
  });
}
