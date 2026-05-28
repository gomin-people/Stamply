import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import MissionPageClient from "@/components/user/mission/MissionPageClient";
import { getEntryEvent } from "@/features/qr/entry/api/entry";
import { getRequestOrigin } from "@/utils/server-url";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function MissionPage({ params }: PageProps) {
  const { eventId: eventIdParam } = await params;

  // 1. getEntryEvent를 사용하여 유저 세션 검증 및 이벤트 정보 동시 획득 (에러 발생 시 내부적으로 redirect 처리됨)
  const event = await getEntryEvent(eventIdParam);

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const baseUrl = await getRequestOrigin();

  // 2. 미션 데이터 조회
  const missionsRes = await fetch(`${baseUrl}/api/v1/participant/missions`, {
    headers: {
      Cookie: cookieHeader,
    },
    next: { revalidate: 0 }, // 실시간 반영을 위해 캐시 무력화
  });

  if (!missionsRes.ok) {
    redirect("/qr-required");
  }

  const { data: missionsData } = await missionsRes.json();

  // API가 ok() 함수에 의해 snake_case -> camelCase로 자동 정규화된 값을 그대로 바인딩합니다.
  const initialMissions = (missionsData.missions ?? []).map(
    (m: {
      id: number;
      title: string;
      description: string | null;
      isCompleted: boolean;
    }) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      isCompleted: m.isCompleted,
    })
  );

  return (
    <MissionPageClient
      event={event}
      eventId={eventIdParam}
      initialMissions={initialMissions}
    />
  );
}
