import { ok, serverError, unauthorized } from "@/utils/api";
import { createSessionClient } from "@/utils/supabase/session-server";

/**
 * RLS 검증 전용 Events 목록 API입니다.
 *
 * service role 클라이언트를 쓰지 않고, 현재 요청의 Supabase 세션 쿠키를
 * 그대로 사용합니다. user_id 필터를 직접 걸지 않아야 DB RLS 적용 여부를
 * 확인할 수 있습니다.
 *
 * 추후 삭제 예정입니다.
 */
export async function GET() {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return unauthorized("카카오 로그인 후 다시 시도해주세요.");
  }

  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("id,title,user_id,created_at")
    .order("created_at", { ascending: false });

  if (eventsError) {
    return serverError("RLS 테스트 Events 목록 조회 실패", eventsError);
  }

  const returnedUserIds = [
    ...new Set(
      events
        ?.map((event) => event.user_id)
        .filter((userId): userId is string => typeof userId === "string") ?? []
    ),
  ];

  return ok({
    current_user_id: user.id,
    event_count: events?.length ?? 0,
    returned_user_ids: returnedUserIds,
    all_rows_belong_to_current_user:
      returnedUserIds.length === 1 && returnedUserIds[0] === user.id,
    events: events ?? [],
  });
}
