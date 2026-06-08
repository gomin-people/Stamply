"use client";

import { useQuery } from "@tanstack/react-query";
import { participantEventQueryOptions } from "./participantEventOptions";

export {
  participantEventQueryOptions,
  participantEventQueryKeys,
} from "./participantEventOptions";

export function useParticipantEventQuery(eventId: number | null | undefined) {
  return useQuery({
    ...participantEventQueryOptions(eventId as number),
    enabled: typeof eventId === "number" && eventId > 0,
  });
}
