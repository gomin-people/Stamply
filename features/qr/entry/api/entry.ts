import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PARTICIPANT_COOKIE_NAME } from '@/utils/api';
import { type StamplyEvent } from '@/features/shared/types/stamply';
import { type ApiDataResponse } from '@/features/shared/api/http';

export async function getEntryEvent(eventId: string): Promise<StamplyEvent> {
  const cookieStore = await cookies();
  const participantCookie = cookieStore.get(PARTICIPANT_COOKIE_NAME);

  if (!participantCookie) {
    redirect('/qrRequired');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/v1/participant/events/${eventId}`, {
    headers: {
      Cookie: `${PARTICIPANT_COOKIE_NAME}=${participantCookie.value}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    redirect('/qrRequired');
  }

  const { data: event } = (await res.json()) as ApiDataResponse<StamplyEvent>;
  return event;
}
