import { resolveRequest, requestJson } from "@/features/shared/api/http";
import { type StamplyEvent } from "@/features/shared/types/stamply";

async function fetchParticipantEvent(eventId: number): Promise<StamplyEvent> {
  const { url, init } = await resolveRequest(
    `/api/v1/participant/events/${eventId}`
  );
  return requestJson<StamplyEvent>(url, init);
}

export const participantEventQueryKeys = {
  detail: (eventId: number) =>
    ["participant", "events", "detail", eventId] as const,
};

export const participantEventQueryOptions = (eventId: number) => ({
  queryKey: participantEventQueryKeys.detail(eventId),
  queryFn: () => fetchParticipantEvent(eventId),
});
