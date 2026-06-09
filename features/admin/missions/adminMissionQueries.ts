"use client";

import { queryOptions } from "@tanstack/react-query";
import { fetchAdminMissions } from "./adminMissionApi";

export const adminMissionQueryOptions = {
  list: (eventId: number) =>
    queryOptions({
      queryKey: ["admin", "events", eventId, "missions"] as const,
      queryFn: () => fetchAdminMissions(eventId),
      enabled: typeof eventId === "number" && eventId > 0,
      staleTime: 60 * 1000,
    }),
};
