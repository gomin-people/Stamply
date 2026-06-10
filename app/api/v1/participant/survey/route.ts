import { type NextRequest } from "next/server";
import {
  badRequest,
  getCurrentParticipant,
  ok,
  pickBodyFields,
  readJsonObject,
  serverError,
} from "@/utils/api";
import { supabase } from "@/utils/supabase/server";

// 설문 저장 시 요청 본문에서 허용하는 필드 목록
const SURVEY_UPDATE_FIELDS = ["gender", "age_range"] as const;

// participant_users.gender enum과 맞춘 허용 성별 값
const GENDERS = ["MALE", "FEMALE", "UNKNOWN"] as const;

/**
 * 현재 참여자의 설문 응답 상태를 조회합니다.
 *
 * @param request - 참여자 식별 쿠키를 포함한 요청 객체
 * @returns 성별, 연령대, 리워드 수령 여부
 */
export async function GET(request: NextRequest) {
  const result = await getCurrentParticipant(request);

  if ("response" in result) {
    return result.response;
  }

  return ok({
    gender: result.participant.gender,
    age_range: result.participant.age_range,
    is_reward_claimed: result.participant.is_reward_claimed,
  });
}

/**
 * 현재 참여자의 설문 응답과 리워드 수령 여부를 저장합니다.
 *
 * @param request - 설문 수정 JSON 본문과 참여자 식별 쿠키를 포함한 요청 객체
 * @returns 수정된 참여자 row
 */
export async function POST(request: NextRequest) {
  const participantResult = await getCurrentParticipant(request);

  if ("response" in participantResult) {
    return participantResult.response;
  }

  const bodyResult = await readJsonObject(request);

  if ("response" in bodyResult) {
    return bodyResult.response;
  }

  const payload = pickBodyFields(bodyResult.body, SURVEY_UPDATE_FIELDS);

  if (Object.keys(payload).length === 0) {
    return badRequest("수정할 설문 필드가 필요합니다.");
  }

  if (Object.prototype.hasOwnProperty.call(payload, "gender")) {
    const gender = payload.gender;

    if (
      gender !== null &&
      (typeof gender !== "string" ||
        !(GENDERS as readonly string[]).includes(gender))
    ) {
      return badRequest("gender는 MALE, FEMALE, UNKNOWN 중 하나여야 합니다.");
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, "age_range")) {
    const ageRange = payload.age_range;

    if (ageRange !== null && typeof ageRange !== "string") {
      return badRequest("ageRange는 문자열이거나 null이어야 합니다.");
    }

    if (typeof ageRange === "string" && ageRange.trim() === "") {
      payload.age_range = null;
    }
  }

  // participant_users 테이블에서 현재 참여자 id 기준 설문 필드 수정 후 조회
  const { data, error } = await supabase
    .from("participant_users")
    .update(payload)
    .eq("id", participantResult.participant.id)
    .select("*")
    .single();

  if (error) {
    return serverError("설문 저장 실패", error);
  }

  return ok(data);
}
