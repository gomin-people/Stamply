import { NextResponse } from "next/server";
import { conflict, notFound, ok, serverError } from "@/utils/api";
import { supabase } from "@/utils/supabase/server";

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

  // 1. 참여자 조회 (service_role 클라이언트 사용)
  const { data: participant, error: participantError } = await supabase
    .from("participant_users")
    .select("*")
    .eq("event_user_id", eventUserId)
    .maybeSingle();

  if (participantError) {
    return serverError("참여자 조회 실패", participantError);
  }

  if (!participant) {
    return notFound("참여자를 찾을 수 없습니다.");
  }

  // 2. 이미 수령했는지 검사
  if (participant.is_reward_claimed) {
    return conflict("이미 리워드를 수령한 참여자입니다.");
  }

  // 3. 리워드 수령 완료 처리 (service_role 클라이언트 사용)
  const { error: updateError } = await supabase
    .from("participant_users")
    .update({ is_reward_claimed: true })
    .eq("id", participant.id);

  if (updateError) {
    return serverError("리워드 수령 상태 업데이트 실패", updateError);
  }

  // 4. Supabase Realtime Broadcast 채널로 성공 이벤트 전송
  const channel = supabase.channel(`reward-claim:${eventUserId}`);
  await channel.send({
    type: "broadcast",
    event: "claim_success",
    payload: { claimedAt: new Date().toISOString() },
  });

  return ok({ success: true });
}
