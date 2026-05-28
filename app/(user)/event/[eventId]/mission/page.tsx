import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { PARTICIPANT_COOKIE_NAME } from '@/utils/api';
import MissionPageClient from '@/components/user/MissionPageClient';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function MissionPage({ params }: PageProps) {
  const { eventId: eventIdParam } = await params;

  const cookieStore = await cookies();
  const eventUserId = cookieStore.get(PARTICIPANT_COOKIE_NAME)?.value || null;

  if (!eventUserId) {
    redirect('/qr-required');
  }

  const cookieHeader = cookieStore.toString();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 1. 참여자 행사 정보 및 완료 여부 사전 조회 (API v1 호출)
  const [eventRes, missionsRes] = await Promise.all([
    fetch(`${baseUrl}/api/v1/participant/events/${eventIdParam}`, {
      headers: {
        Cookie: cookieHeader,
      },
      next: { revalidate: 0 }, // 실시간 반영을 위해 캐시 무력화
    }),
    fetch(`${baseUrl}/api/v1/participant/missions`, {
      headers: {
        Cookie: cookieHeader,
      },
      next: { revalidate: 0 }, // 실시간 반영을 위해 캐시 무력화
    }),
  ]);

  if (!eventRes.ok || !missionsRes.ok) {
    // 만약 참여자 쿠키 세션이 만료되거나 세션 불일치 등으로 401을 반환하면 QR 재인증(쿠키 재발급)으로 유도
    if (eventRes.status === 401 || missionsRes.status === 401) {
      redirect('/qr-required');
    }
    return notFound();
  }

  const { data: event } = await eventRes.json();
  const { data: missionsData } = await missionsRes.json();

  // API가 ok() 함수에 의해 snake_case -> camelCase로 자동 정규화된 값을 그대로 바인딩합니다.
  const initialMissions = (missionsData.missions ?? []).map((m: any) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    isCompleted: m.isCompleted,
    token: m.token,
  }));

  return (
    <MissionPageClient
      event={event}
      eventId={eventIdParam}
      initialMissions={initialMissions}
    />
  );
}
