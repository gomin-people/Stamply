import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase/server';
import { PARTICIPANT_COOKIE_NAME } from '@/utils/api';
import MissionPageClient from '@/components/user/MissionPageClient';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function MissionPage({ params }: PageProps) {
  const { eventId: eventIdParam } = await params;
  const eventId = Number(eventIdParam);

  // 1. 이미 layout.tsx에서 유효한 이벤트 ID 및 존재 유무가 완전히 검증되었습니다.
  // 여기서는 미션 보드에서 필요한 실제 DB 데이터를 정확하게 가져옵니다.
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .maybeSingle();

  if (!event) {
    return notFound();
  }

  // 2. missions 테이블에서 해당 행사의 활성화된 미션 데이터들을 조회합니다.
  const { data: dbMissions } = await supabase
    .from('missions')
    .select('*')
    .eq('events_id', eventId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  // 3. 참여자 식별 쿠키를 통해 해당 유저의 미션 완료 기록(mission_completions) 및 미션별 QR 토큰들을 사전 조회합니다.
  const cookieStore = await cookies();
  const eventUserId = cookieStore.get(PARTICIPANT_COOKIE_NAME)?.value || null;

  const [
    { data: participant },
    { data: qrCodes }
  ] = await Promise.all([
    supabase
      .from('participant_users')
      .select('id')
      .eq('event_user_id', eventUserId || '')
      .maybeSingle(),
    supabase
      .from('qr_codes')
      .select('missions_id,token')
      .eq('events_id', eventId)
      .eq('type', 'MISSION'),
  ]);

  let completedMissionsIds: number[] = [];

  if (participant) {
    const { data: completions } = await supabase
      .from('mission_completions')
      .select('missions_id')
      .eq('events_id', eventId)
      .eq('participant_users_id', participant.id);

    if (completions) {
      completedMissionsIds = completions.map((c) => c.missions_id);
    }
  }

  const qrMap = new Map<number, string>();
  for (const qr of qrCodes ?? []) {
    if (typeof qr.missions_id === 'number' && typeof qr.token === 'string') {
      qrMap.set(qr.missions_id, qr.token);
    }
  }

  // 4. 조회한 미션 데이터에 완료 여부(isCompleted) 및 QR 토큰(token) 정보를 바인딩하여 줍니다.
  const initialMissions = (dbMissions ?? []).map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    isCompleted: completedMissionsIds.includes(m.id),
    token: qrMap.get(m.id) ?? null,
  }));

  return (
    <MissionPageClient
      event={event}
      eventId={eventIdParam}
      initialMissions={initialMissions}
    />
  );
}
