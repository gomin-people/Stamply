import participantAnalysisData from "@/mocks/dashboard/participant-analysis.json";
import {
  badRequest,
  notFound,
  ok,
  parsePositiveInteger,
  serverError,
} from "@/utils/api";
import { authorizeAdminEvent } from "@/utils/admin-event-auth";
import { supabase } from "@/utils/supabase/server";

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

  if (process.env.DASHBOARD_DATA_SOURCE === "local-json") {
    return ok(participantAnalysisData);
  }

  const [
    { data: event, error: eventError },
    { data: participants, error: participantsError },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("start_date,end_date")
      .eq("id", eventId)
      .maybeSingle(),
    supabase
      .from("participant_users")
      .select("created_at")
      .eq("events_id", eventId),
  ]);

  if (eventError) {
    return serverError("대시보드 참여자 분석 행사 기간 조회 실패", eventError);
  }

  if (!event) {
    return notFound("행사를 찾을 수 없습니다.");
  }

  if (participantsError) {
    return serverError(
      "대시보드 참여자 분석 원천 데이터 조회 실패",
      participantsError
    );
  }

  const dateLabels = getDateLabels(event.start_date, event.end_date);
  const dailyCounts = new Map(dateLabels.map((label) => [label, 0]));
  const hourlyCounts = new Map(
    Array.from({ length: 24 }, (_, hour) => [hour, 0])
  );

  for (const participant of participants ?? []) {
    const dateLabel = getTimestampDateLabel(participant.created_at);
    const hour = getTimestampHour(participant.created_at);

    dailyCounts.set(dateLabel, (dailyCounts.get(dateLabel) ?? 0) + 1);
    hourlyCounts.set(hour, (hourlyCounts.get(hour) ?? 0) + 1);
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
  const totalParticipantCount = participants?.length ?? 0;
  const hourlyDateFactors = daily.map((item) => ({
    label: item.label,
    factor:
      totalParticipantCount === 0 ? 0 : item.count / totalParticipantCount,
  }));

  return ok({
    daily,
    hourly_total: hourlyTotal,
    hourly_date_factors: hourlyDateFactors,
  });
}

const getDateLabels = (startDate: string, endDate: string) => {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!start || !end || start > end) {
    return [];
  }

  const labels: string[] = [];
  const current = new Date(start);

  while (current <= end && labels.length < 370) {
    labels.push(formatDateLabel(current));
    current.setDate(current.getDate() + 1);
  }

  return labels;
};

const parseDateOnly = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
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

const formatDateLabel = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()}`;
