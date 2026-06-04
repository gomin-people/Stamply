import { type NextRequest } from "next/server";
import {
  badRequest,
  notFound,
  ok,
  parsePositiveInteger,
  serverError,
} from "@/utils/api";
import { supabase } from "@/utils/supabase/server";

type EventThemeRouteContext = {
  params: Promise<{ eventId: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: EventThemeRouteContext
) {
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest("올바른 행사 ID가 필요합니다.");
  }

  const { data: event, error } = await supabase
    .from("events")
    .select("primary_color")
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    return serverError("행사 테마 조회 실패", error);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  return ok(event);
}
