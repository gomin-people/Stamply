import {
  badRequest,
  created,
  getMissingFields,
  ok,
  pickBodyFields,
  readJsonObject,
  serverError,
  toInteger,
  unauthorized,
} from "@/utils/api";
import { supabase } from "@/utils/supabase/server";
import { createSessionClient } from "@/utils/supabase/session-server";

// 행사 생성 시 요청 본문에서 허용하는 필드 목록
const EVENT_INSERT_FIELDS = [
  "title",
  "start_date",
  "end_date",
  "start_time",
  "end_time",
  "operating_remarks",
  "location",
  "location_url",
  "notice",
  "contact_phone",
  "contact_email",
  "production",
  "poster_image_url",
  "brochure_image_url",
  "stamp_image_url",
  "primary_color",
  "reward_stock",
] as const;

// DB not null 컬럼과 MVP 생성 플로우 기준의 필수 행사 필드
const EVENT_REQUIRED_FIELDS = [
  "title",
  "start_date",
  "end_date",
  "start_time",
  "end_time",
  "location",
  "production",
  "poster_image_url",
] as const;

/**
 * 어드민 행사 목록을 조회합니다.
 *
 * @returns 현재 로그인한 운영자의 행사 목록
 */
export async function GET() {
  const sessionSupabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await sessionSupabase.auth.getUser();

  if (userError || !user) {
    return unauthorized("인증되지 않은 사용자입니다.");
  }

  // events 테이블은 RLS(auth.uid() = user_id)로 현재 운영자 소유 row만 조회됩니다.
  const { data, error } = await sessionSupabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    return serverError("어드민 행사 목록 조회 실패", error);
  }

  return ok(data ?? []);
}

/**
 * 어드민 행사를 생성하고 ENTRY QR을 함께 발급합니다.
 *
 * @param request - 행사 생성 JSON 본문
 * @returns 생성된 행사와 입장 QR 코드 목록
 */
export async function POST(request: Request) {
  const sessionSupabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await sessionSupabase.auth.getUser();

  if (userError || !user) {
    return unauthorized("인증되지 않은 사용자입니다.");
  }

  const result = await readJsonObject(request);

  if ("response" in result) {
    return result.response;
  }

  const missingFields = getMissingFields(result.body, EVENT_REQUIRED_FIELDS);

  if (missingFields.length > 0) {
    return badRequest("필수 행사 필드가 누락되었습니다.", {
      fields: missingFields,
    });
  }

  const rewardStock = toInteger(result.body.reward_stock);

  if (
    Object.prototype.hasOwnProperty.call(result.body, "reward_stock") &&
    (rewardStock === null || rewardStock < 0)
  ) {
    return badRequest("rewardStock은 0 이상의 정수여야 합니다.");
  }

  const now = new Date().toISOString();
  const eventPayload = {
    ...pickBodyFields(result.body, EVENT_INSERT_FIELDS),
    user_id: user.id,
    ...(rewardStock === null ? {} : { reward_stock: rewardStock }),
    created_at: now,
    updated_at: now,
  };

  // events 테이블은 RLS with check(auth.uid() = user_id)를 통과해야 생성됩니다.
  const { data: event, error: eventError } = await sessionSupabase
    .from("events")
    .insert(eventPayload)
    .select("*")
    .single();

  if (eventError) {
    return serverError("행사 생성 실패", eventError);
  }

  // qr_codes 테이블에 events_id와 type ENTRY를 가진 입장 QR row 삽입 후 조회
  const { data: qrCodes, error: qrCodeError } = await supabase
    .from("qr_codes")
    .insert({
      events_id: event.id,
      missions_id: null,
      type: "ENTRY",
      created_at: now,
    })
    .select("*");

  if (qrCodeError) {
    // QR 생성 실패 시 고아 행사가 남지 않도록 생성된 행사를 정리
    // events 테이블에서 생성된 행사 id 기준으로 row 삭제
    await sessionSupabase.from("events").delete().eq("id", event.id);
    return serverError("행사 QR 생성 실패", qrCodeError);
  }

  return created({
    ...event,
    qr_codes: qrCodes ?? [],
  });
}
