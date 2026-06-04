import { type NextRequest } from "next/server";
import {
  badRequest,
  forbidden,
  getCurrentParticipant,
  notFound,
  ok,
  parsePositiveInteger,
  serverError,
} from "@/utils/api";
import { supabase } from "@/utils/supabase/server";

// 참여자 Events route parameter 타입
type ParticipantEventRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

/**
 * 쿠키 기준 현재 참여자가 입장한 행사를 조회합니다.
 *
 * @param request - 참여자 식별 쿠키를 포함한 요청 객체
 * @param context - 행사 ID route parameter
 * @returns 현재 참여자가 입장한 행사 정보
 */
export async function GET(
  request: NextRequest,
  { params }: ParticipantEventRouteContext
) {
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest("올바른 행사 ID가 필요합니다.");
  }

  const result = await getCurrentParticipant(request);

  if ("response" in result) {
    return result.response;
  }

  if (result.participant.events_id !== eventId) {
    return forbidden("입장한 행사만 조회할 수 있습니다.");
  }

  // events 테이블에서 id가 현재 참여자의 events_id와 일치하는 행사 전체 컬럼 조회
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    return serverError("참여 행사 조회 실패", eventError);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  return ok(event);
}
