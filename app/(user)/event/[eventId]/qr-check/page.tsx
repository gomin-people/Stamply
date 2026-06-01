import QrCheckClient from "@/components/user/qr-check/QrCheckClient";
import { getEntryEvent } from "@/features/qr/entry/api/entry";

type QrCheckPageProps = {
  params: Promise<{ eventId: string }>;
};

/**
 * QR 스캔 화면 진입 전 참여자 쿠키와 현재 행사 접근 권한을 확인합니다.
 *
 * @param props - QR 스캔 페이지 route parameter
 * @returns 권한 확인 후 QR 스캔 클라이언트 화면
 */
export default async function QrCheckPage({ params }: QrCheckPageProps) {
  const { eventId } = await params;

  await getEntryEvent(eventId);

  return <QrCheckClient eventId={eventId} />;
}
