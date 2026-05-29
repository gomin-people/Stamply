import { type NextRequest, NextResponse } from "next/server";
import {
  badRequest,
  clearParticipantCookie,
  conflict,
  created,
  forbidden,
  getCurrentParticipant,
  getErrorCode,
  notFound,
  type ParticipantRow,
  serverError,
} from "@/utils/api";
import { supabase } from "@/utils/supabase/server";

// 미션 완료 QR route parameter 타입
type MissionCheckRouteContext = {
  params: Promise<{
    token: string;
  }>;
};

const getMissionCheckData = async (
  token: string,
  participant: ParticipantRow,
  missionSelect: "id" | "*" = "id"
) => {
  if (!token) {
    return { response: badRequest("QR 토큰이 필요합니다.") };
  }

  // qr_codes 테이블에서 token과 type MISSION 기준 QR 전체 컬럼 조회
  const { data: qrCode, error: qrCodeError } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("token", token)
    .eq("type", "MISSION")
    .maybeSingle();

  if (qrCodeError) {
    return { response: serverError("미션 QR 조회 실패", qrCodeError) };
  }

  if (!qrCode) {
    return { response: notFound("미션 QR을 찾을 수 없습니다.") };
  }

  if (typeof qrCode.missions_id !== "number") {
    return { response: badRequest("미션 QR에 연결된 미션이 없습니다.") };
  }

  // 다른 행사에서 발급된 미션 QR을 현재 참여자가 사용할 수 없도록 차단
  if (participant.events_id !== qrCode.events_id) {
    return {
      response: forbidden("현재 참여 중인 행사의 미션 QR이 아닙니다."),
    };
  }

  // missions 테이블에서 QR의 missions_id, events_id, is_active 기준 미션 조회
  const { data: mission, error: missionError } = await supabase
    .from("missions")
    .select(missionSelect)
    .eq("id", qrCode.missions_id)
    .eq("events_id", qrCode.events_id)
    .eq("is_active", true)
    .maybeSingle();

  if (missionError) {
    return { response: serverError("미션 조회 실패", missionError) };
  }

  if (!mission) {
    return { response: notFound("활성 미션을 찾을 수 없습니다.") };
  }

  return { qrCode, mission };
};

/**
 * MISSION QR 토큰으로 미션 완료를 저장하고 미션 페이지로 이동합니다.
 *
 * @param request - 참여자 식별 쿠키를 포함한 요청 객체
 * @param context - QR token route parameter
 * @returns 미션 완료 후 미션 페이지 redirect 응답
 */
export async function GET(
  request: NextRequest,
  { params }: MissionCheckRouteContext
) {
  const { token } = await params;
  const participantResult = await getCurrentParticipant(request);

  // 쿠키가 없거나 쿠키가 있는데 참여자 정보 조회 실패한 경우 모두 QR 체크 필요 페이지로 리다이렉트
  if ("response" in participantResult) {
    if (
      participantResult.response.status !== 401 &&
      participantResult.response.status !== 404
    ) {
      return participantResult.response;
    }

    const response = NextResponse.redirect(
      new URL("/qr-required", request.url)
    );
    clearParticipantCookie(response);
    return response;
  }

  const missionCheckData = await getMissionCheckData(
    token,
    participantResult.participant
  );
  if ("response" in missionCheckData) {
    return missionCheckData.response;
  }

  // mission_completions 테이블에 events_id, missions_id, participant_users_id 기준 완료 기록 삽입
  const { error: completionError } = await supabase
    .from("mission_completions")
    .insert({
      events_id: missionCheckData.qrCode.events_id,
      missions_id: missionCheckData.qrCode.missions_id,
      participant_users_id: participantResult.participant.id,
      completed_at: new Date().toISOString(),
    });

  if (completionError && getErrorCode(completionError) !== "23505") {
    return serverError("미션 완료 저장 실패", completionError);
  }

  return NextResponse.redirect(
    new URL(`/event/${missionCheckData.qrCode.events_id}/mission`, request.url)
  );
}

/**
 * MISSION QR 토큰으로 현재 참여자의 미션 완료를 저장합니다.
 *
 * @param request - 참여자 식별 쿠키를 포함한 요청 객체
 * @param context - QR token route parameter
 * @returns 완료된 미션과 미션 완료 기록
 */
export async function POST(
  request: NextRequest,
  { params }: MissionCheckRouteContext
) {
  const { token } = await params;
  const participantResult = await getCurrentParticipant(request);

  if ("response" in participantResult) {
    return participantResult.response;
  }

  const missionCheckData = await getMissionCheckData(
    token,
    participantResult.participant,
    "*"
  );
  if ("response" in missionCheckData) {
    return missionCheckData.response;
  }

  // mission_completions 테이블에 events_id, missions_id, participant_users_id 기준 완료 기록 삽입 후 조회
  const { data: completion, error: completionError } = await supabase
    .from("mission_completions")
    .insert({
      events_id: missionCheckData.qrCode.events_id,
      missions_id: missionCheckData.qrCode.missions_id,
      participant_users_id: participantResult.participant.id,
      completed_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (completionError) {
    // 중복 완료는 DB unique constraint의 23505 에러로 판별
    if (getErrorCode(completionError) === "23505") {
      // mission_completions 테이블에서 missions_id와 participant_users_id 기준 기존 완료 기록 조회
      const { data: existingCompletion } = await supabase
        .from("mission_completions")
        .select("*")
        .eq("missions_id", missionCheckData.qrCode.missions_id)
        .eq("participant_users_id", participantResult.participant.id)
        .maybeSingle();

      return conflict("이미 완료한 미션입니다.", {
        completion: existingCompletion,
      });
    }

    return serverError("미션 완료 저장 실패", completionError);
  }

  return created({
    mission: missionCheckData.mission,
    completion,
  });
}
