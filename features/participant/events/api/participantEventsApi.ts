import { requestJson } from '@/features/shared/api/http';
import { type StamplyEvent } from '@/features/shared/types/stamply';

export function getParticipantEvent(eventId: number) {
  return requestJson<StamplyEvent>(`/api/v1/participant/events/${eventId}`);
}

export function getEventTheme(eventId: number) {
  return requestJson<{ primary_color: string }>(`/api/v1/participant/events/${eventId}/theme`);
}

export async function getEventPrimaryColor(eventId: string): Promise<string | null> {
  try {
    const data = await requestJson<{ primaryColor: string }>(`/api/v1/participant/events/${eventId}/theme`);
    return data?.primaryColor ?? null;
  } catch {
    return null;
  }
}
