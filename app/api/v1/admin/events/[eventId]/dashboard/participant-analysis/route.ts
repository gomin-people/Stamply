import {
  badRequest,
  notFound,
  ok,
  parsePositiveInteger,
  serverError,
} from "@/utils/api";
import { authorizeAdminEvent } from "@/utils/admin-event-auth";
import {
  type AdminDashboardDateWindow,
  getAdminDashboardDateLabels,
  getAdminDashboardDateWindow,
} from "@/utils/admin-dashboard-date";
import { supabase } from "@/utils/supabase/server";

const PARTICIPANTS_PAGE_SIZE = 1000;

// 어드민 대시보드 참여자 수 분석 route parameter 타입
type AdminDashboardParticipantAnalysisRouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

/**
 * 특정 행사의 어드민 대시보드 참여자 수 분석 데이터를 조회합니다.
 *
 * @param request - Route Handler 요청 객체
 * @param context - 행사 ID route parameter
 * @returns 날짜별, 시간대별 참여자 수 데이터
 */
export async function GET(
  request: Request,
  { params }: AdminDashboardParticipantAnalysisRouteContext
) {
  void request;
  const { eventId: eventIdParam } = await params;
  const eventId = parsePositiveInteger(eventIdParam);

  if (eventId === null) {
    return badRequest("올바른 행사 ID가 필요합니다.");
  }

  const authorization = await authorizeAdminEvent(
    eventId,
    "대시보드 참여자 수 분석"
  );

  if ("response" in authorization) {
    return authorization.response;
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("start_date,end_date")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    return serverError("대시보드 참여자 분석 행사 기간 조회 실패", eventError);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  const dateLabels = getAdminDashboardDateLabels(
    event.start_date,
    event.end_date
  );
  const dashboardDateWindow = getAdminDashboardDateWindow(
    event.start_date,
    event.end_date
  );

  const { data: participantCreatedAts, error: participantsError } =
    await fetchParticipantCreatedAts(eventId, dashboardDateWindow);

  if (participantsError) {
    return serverError(
      "대시보드 참여자 분석 원천 데이터 조회 실패",
      participantsError
    );
  }

  const dailyCounts = new Map(dateLabels.map((label) => [label, 0]));
  const hourlyCounts = new Map(
    Array.from({ length: 24 }, (_, hour) => [hour, 0])
  );
  let includedParticipantCount = 0;

  for (const createdAt of participantCreatedAts ?? []) {
    const dateLabel = getTimestampDateLabel(createdAt);

    if (!dailyCounts.has(dateLabel)) {
      continue;
    }

    const hour = getTimestampHour(createdAt);

    dailyCounts.set(dateLabel, (dailyCounts.get(dateLabel) ?? 0) + 1);
    hourlyCounts.set(hour, (hourlyCounts.get(hour) ?? 0) + 1);
    includedParticipantCount += 1;
  }

  const daily = Array.from(dailyCounts.entries()).map(([label, count]) => ({
    label,
    count,
  }));
  const hourlyTotal = Array.from(hourlyCounts.entries())
    .sort(([hourA], [hourB]) => hourA - hourB)
    .map(([hour, count]) => ({
      hour,
      label: `${hour}시`,
      count,
    }));
  const hourlyDateFactors = daily.map((item) => ({
    label: item.label,
    factor:
      includedParticipantCount === 0
        ? 0
        : item.count / includedParticipantCount,
  }));

  return ok({
    daily,
    hourly_total: hourlyTotal,
    hourly_date_factors: hourlyDateFactors,
  });
}

const fetchParticipantCreatedAts = async (
  eventId: number,
  dashboardDateWindow: AdminDashboardDateWindow | null
) => {
  if (!dashboardDateWindow) {
    return { data: [], error: null };
  }

  const createdAts: string[] = [];

  for (let from = 0; ; from += PARTICIPANTS_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("participant_users")
      .select("created_at")
      .eq("events_id", eventId)
      .gte("created_at", dashboardDateWindow.startsAt)
      .lt("created_at", dashboardDateWindow.endsBefore)
      .order("id", { ascending: true })
      .range(from, from + PARTICIPANTS_PAGE_SIZE - 1);

    if (error) {
      return { data: null, error };
    }

    const rows = data ?? [];

    for (const row of rows) {
      if (typeof row.created_at === "string") {
        createdAts.push(row.created_at);
      }
    }

    if (rows.length < PARTICIPANTS_PAGE_SIZE) {
      return { data: createdAts, error: null };
    }
  }
};

const getTimestampDateLabel = (value: string) => {
  const [datePart] = value.split("T");
  const [, month, day] = datePart.split("-").map(Number);

  if (!month || !day) {
    return datePart;
  }

  return `${month}/${day}`;
};

const getTimestampHour = (value: string) => {
  const timePart = value.split("T")[1] ?? "";
  const hour = Number(timePart.slice(0, 2));

  return Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : 0;
};
