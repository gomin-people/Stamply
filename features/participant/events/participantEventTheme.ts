import { requestJson } from '@/features/shared/api/http';

export async function getEventPrimaryColor(
  eventId: string
): Promise<string | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const data = await requestJson<{ primaryColor: string }>(
      `${baseUrl}/api/v1/participant/events/${eventId}/theme`
    );

    return data?.primaryColor ?? null;
  } catch {
    return null;
  }
}
