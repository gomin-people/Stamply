import { redirect } from "next/navigation";
import CompletePageClient from "@/components/user/mission/CompletePageClient";
import { getEntryEvent } from "@/features/qr/entry/api/entry";
import { resolveRequest } from "@/features/shared/api/http";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function CompletePage({ params }: PageProps) {
  const { eventId: eventIdParam } = await params;

  // 1. getEntryEvent를 사용하여 유저 세션 검증 (실패 시 내부적으로 redirect)
  await getEntryEvent(eventIdParam);

  // 2. 참여자 세션 쿠키를 담아 API 요청을 전송하여 권한 유효성 엄격 검증
  const { url, init } = await resolveRequest("/api/v1/participant/missions", {
    next: { revalidate: 0 },
  });
  const missionsRes = await fetch(url, init);

  if (!missionsRes.ok) {
    redirect("/qr-required");
  }

  return <CompletePageClient />;
}
