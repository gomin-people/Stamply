"use client";

import { useQuery } from "@tanstack/react-query";
import { requestJson } from "@/features/shared/api/http";
import { type EventModel } from "@/types/models";

function getParticipantEvent(eventId: number) {
  return requestJson<EventModel>(`/api/v1/participant/events/${eventId}`);
}

/**
 * 현재 참여자가 입장한 행사를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns React Query 참여자 행사
 */
export function useParticipantEventQuery(eventId: number | null | undefined) {
  return useQuery({
    queryKey: ["participant", "events", "detail", eventId],
    queryFn: () => getParticipantEvent(eventId as number),
    enabled: typeof eventId === "number" && eventId > 0,
  });
}
