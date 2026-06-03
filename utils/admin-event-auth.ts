import "server-only";
import { type NextResponse } from "next/server";
import { notFound, serverError, unauthorized } from "@/utils/api";
import { createSessionClient } from "@/utils/supabase/session-server";

type AdminEventAuthorizationResult =
  | {
      eventId: number;
    }
  | {
      response: NextResponse;
    };

/**
 * 관리자 행사 API에서 현재 사용자의 행사 소유권을 확인합니다.
 *
 * @param eventId - 행사 ID
 * @param errorContext - 서버 에러 메시지에 붙일 API 설명
 * @returns 권한 확인에 성공한 행사 ID 또는 즉시 반환할 에러 응답
 */
export async function authorizeAdminEvent(
  eventId: number,
  errorContext: string
): Promise<AdminEventAuthorizationResult> {
  const sessionSupabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await sessionSupabase.auth.getUser();

  if (userError || !user) {
    return { response: unauthorized("인증되지 않은 사용자입니다.") };
  }

  // events 테이블은 RLS로 현재 운영자 소유 row만 조회됩니다.
  const { data: event, error: eventError } = await sessionSupabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    return {
      response: serverError(`${errorContext} 행사 권한 확인 실패`, eventError),
    };
  }

  if (!event) {
    return { response: notFound("행사를 찾을 수 없습니다.") };
  }

  return { eventId };
}
