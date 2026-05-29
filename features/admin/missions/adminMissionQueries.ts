"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminMissions, fetchAdminMission } from "./adminMissionApi";

export function useAdminMissionsQuery(eventId: number) {
  return useQuery({
    queryKey: ["admin", "events", eventId, "missions"],
    queryFn: () => fetchAdminMissions(eventId),
    enabled: typeof eventId === "number" && eventId > 0,
    staleTime: 60 * 1000,
  });
}

export function useAdminMissionQuery(eventId: number, missionId: number) {
  return useQuery({
    queryKey: ["admin", "events", eventId, "missions", missionId],
    queryFn: () => fetchAdminMission(eventId, missionId),
    enabled:
      typeof eventId === "number" &&
      eventId > 0 &&
      typeof missionId === "number" &&
      missionId > 0,
  });
}
