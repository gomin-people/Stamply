import { NextResponse } from "next/server";
import { badRequest, conflict, notFound, ok, serverError } from "@/utils/api";
import { supabase } from "@/utils/supabase/server";
import { createSessionClient } from "@/utils/supabase/session-server";

type QrRewardRouteContext = {
  params: Promise<{
    token: string;
  }>;
};

/**
 * QR 코드 토큰(event_user_id)을 기반으로 리워드 수령 처리를 진행하고,
 * 수령 완료 시 Supabase Realtime Broadcast를 통해 해당 유저에게 실시간 알림을 보냅니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 참여자 토큰(event_user_id) route parameter
 * @returns 처리 결과 JSON
 */
export async function POST(request: Request, { params }: QrRewardRouteContext) {
  void request;
  const { token: eventUserId } = await params;

  if (!eventUserId) {
    return NextResponse.json(
      { message: "올바른 토큰이 필요합니다." },
      { status: 400 }
    );
  }

  // 1. 요청자 세션 검증 (스태프/어드민 세션 확보)
  const sessionClient = await createSessionClient();
  const {
    data: { user },
    error: authError,
  } = await sessionClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  // 2. 참여자, 행사 소유 여부, 활성 미션 목록 및 완료 미션 목록 단일 조인 조회 (service_role 클라이언트 사용)
  const { data: participant, error: participantError } = await supabase
    .from("participant_users")
    .select(
      `
      *,
      events (
        id,
        user_id,
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

  // 3. 해당 행사의 소유자가 현재 로그인한 관리자인지 검증
  type EventOwnerInfo = {
    id: number;
    user_id: string;
    missions: { id: number; is_active: boolean }[];
  };
  const rawEvents = participant.events;
  const eventData = (Array.isArray(rawEvents)
    ? rawEvents[0]
    : rawEvents) as unknown as EventOwnerInfo | null;

  if (!eventData || eventData.user_id !== user.id) {
    return NextResponse.json(
      { message: "해당 행사에 대한 관리 권한이 없습니다." },
      { status: 403 }
    );
  }

  // 4. 이미 수령했는지 검사
  if (participant.is_reward_claimed) {
    return conflict("이미 리워드를 수령한 참여자입니다.");
  }

  // 4-1. 미션 완료 여부 검증 (활성화된 미션이 최소 1개 이상 존재하고, 모두 완료했는지 확인)
  const missions = eventData.missions ?? [];
  const activeMissions = Array.isArray(missions)
    ? missions.filter((m: { id: number; is_active: boolean }) => m.is_active)
    : [];
  const activeMissionsCount = activeMissions.length;

  const completions = participant.mission_completions ?? [];
  const completedMissionsCount = Array.isArray(completions)
    ? completions.length
    : 0;

  if (
    activeMissionsCount === 0 ||
    completedMissionsCount < activeMissionsCount
  ) {
    return badRequest("모든 필수 미션을 완료하지 않았습니다.");
  }

  // 5. 리워드 수령 완료 처리 (service_role 클라이언트 사용)
  const { error: updateError } = await supabase
    .from("participant_users")
    .update({ is_reward_claimed: true })
    .eq("id", participant.id);

  if (updateError) {
    return serverError("리워드 수령 상태 업데이트 실패", updateError);
  }

  // 6. Supabase Realtime Broadcast 채널로 성공 이벤트 전송
  const channel = supabase.channel(`reward-claim:${eventUserId}`);
  try {
    await channel.send({
      type: "broadcast",
      event: "claim_success",
      payload: { claimedAt: new Date().toISOString() },
    });
  } finally {
    await supabase.removeChannel(channel);
  }

  return ok({ success: true });
}
