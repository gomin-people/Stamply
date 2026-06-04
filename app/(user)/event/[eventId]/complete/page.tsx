import CompletePageClient from "@/components/user/mission/CompletePageClient";
import { getEntryEventAndParticipant } from "@/features/qr/entry/api/entry";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function CompletePage({ params }: PageProps) {
  const { eventId: eventIdParam } = await params;

  // 세션 검증 및 이벤트 정보, 참여자 정보 획득
  // getEntryEventAndParticipant 내부에서 쿠키 유효성, 참여자 존재 여부, 행사 일치 여부를 모두 검증한다.
  await getEntryEventAndParticipant(eventIdParam);

  return <CompletePageClient />;
}
