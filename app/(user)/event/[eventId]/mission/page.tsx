import { redirect } from "next/navigation";
import MissionPageClient from "@/components/user/mission/MissionPageClient";
import { getEntryEventAndParticipant } from "@/features/qr/entry/api/entry";
import { getParticipantMissionsServer } from "@/features/participant/missions/participantMissionsServer";

type PageProps = {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ newMission?: string }>;
};

export default async function MissionPage({ params, searchParams }: PageProps) {
  const { eventId: eventIdParam } = await params;
  const { newMission } = await searchParams;
  const newStampedId = newMission ? Number(newMission) : null;

  // 1. 세션 검증 및 이벤트 정보, 참여자 정보를 단일 쿼리로 획득
  const { event, participant } =
    await getEntryEventAndParticipant(eventIdParam);

  // 2. 미션 데이터 직접 DB 조회 (참여자 정보 재사용)
  let initialMissions = [];
  try {
    const missions = await getParticipantMissionsServer(participant);
    initialMissions = missions.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      isCompleted: m.isCompleted,
    }));
  } catch (error) {
    console.error("Failed to load missions:", error);
    redirect("/qr-required");
  }

  return (
    <MissionPageClient
      event={event}
      eventId={eventIdParam}
      initialMissions={initialMissions}
      newlyStampedId={newStampedId}
    />
  );
}
