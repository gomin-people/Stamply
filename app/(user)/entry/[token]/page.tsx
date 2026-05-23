import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase/server';
import { PARTICIPANT_COOKIE_NAME, parseOptionalPositiveInteger } from '@/utils/api';

type EntryPageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ userId?: string }>;
};

export default async function EntryPage({ params, searchParams }: EntryPageProps) {
  const { token } = await params;
  const { userId: userIdParam } = await searchParams;

  const userId = parseOptionalPositiveInteger(userIdParam ?? null);

  const { data: qrCode } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('token', token)
    .eq('type', 'ENTRY')
    .maybeSingle();

  if (!qrCode) redirect('/qrRequired');

  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('id', qrCode.events_id)
    .maybeSingle();

  if (!event) redirect('/qrRequired');

  const cookieStore = await cookies();
  const currentEventUserId = cookieStore.get(PARTICIPANT_COOKIE_NAME)?.value ?? null;

  if (currentEventUserId) {
    const { data: currentParticipant } = await supabase
      .from('participant_users')
      .select('event_user_id')
      .eq('event_user_id', currentEventUserId)
      .eq('events_id', qrCode.events_id)
      .maybeSingle();

    if (currentParticipant) {
      cookieStore.set({
        name: PARTICIPANT_COOKIE_NAME,
        value: currentParticipant.event_user_id,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      redirect(`/event/${event.id}`);
    }
  }

  const { data: participant } = await supabase
    .from('participant_users')
    .insert({
      events_id: qrCode.events_id,
      user_id: userId,
      created_at: new Date().toISOString(),
    })
    .select('event_user_id')
    .single();

  if (!participant) redirect('/qrRequired');

  cookieStore.set({
    name: PARTICIPANT_COOKIE_NAME,
    value: participant.event_user_id,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(`/event/${event.id}`);
}
