import { requestJson, resolveRequest } from "@/features/shared/api/http";
import type { AdminMissionDetail } from "@/types/models";

export async function fetchAdminMissions(
  eventId: number
): Promise<AdminMissionDetail[]> {
  const { url, init } = await resolveRequest(
    `/api/v1/admin/events/${eventId}/missions`
  );
  return requestJson<AdminMissionDetail[]>(url, init);
}

export async function fetchAdminMission(
  eventId: number,
  missionId: number
): Promise<AdminMissionDetail> {
  const { url, init } = await resolveRequest(
    `/api/v1/admin/events/${eventId}/missions/${missionId}`
  );
  return requestJson<AdminMissionDetail>(url, init);
}
