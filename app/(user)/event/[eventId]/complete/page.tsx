import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import CompletePageClient from "@/components/user/mission/CompletePageClient";
import { getEntryEvent } from "@/features/qr/entry/api/entry";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function CompletePage({ params }: PageProps) {
  const { eventId: eventIdParam } = await params;

  // 1. getEntryEvent를 사용하여 유저 세션 검증 (실패 시 내부적으로 redirect)
  await getEntryEvent(eventIdParam);

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // 2. 참여자 세션 쿠키를 담아 API 요청을 전송하여 권한 유효성 엄격 검증
  const missionsRes = await fetch(`${baseUrl}/api/v1/participant/missions`, {
    headers: {
      Cookie: cookieHeader,
    },
    next: { revalidate: 0 }, // 실시간 인증 상태 반영을 위해 캐시 방지
  });

  if (!missionsRes.ok) {
    redirect("/qr-required");
  }

  return <CompletePageClient />;
}
