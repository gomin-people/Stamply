import { requestJson } from '@/features/shared/api/http';

export async function getEventPrimaryColor(
  eventId: string
): Promise<string | null> {
  try {
    const data = await requestJson<{ primaryColor: string }>(
      `/api/v1/participant/events/${eventId}/theme`
    );

    return data?.primaryColor ?? null;
  } catch {
    return null;
  }
}
