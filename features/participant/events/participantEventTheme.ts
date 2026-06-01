import { requestJson } from "@/features/shared/api/http";
import { getRequestOrigin } from "@/utils/server-url";

export const getEventPrimaryColor = async (
  eventId: string
): Promise<string | null> => {
  try {
    const baseUrl = await getRequestOrigin();
    const data = await requestJson<{ primaryColor: string }>(
      `${baseUrl}/api/v1/participant/events/${eventId}/theme`
    );

    return data?.primaryColor ?? null;
  } catch {
    return null;
  }
};
