import { notFound } from 'next/navigation';
import { validateEvent } from '@/utils/api';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}

export default async function EventLayout({ children, params }: LayoutProps) {
  const { eventId: eventIdParam } = await params;

  // 공통 API 서비스 모듈(validateEvent)을 통해 행사 ID 및 존재 여부를 단 한 줄로 검증합니다.
  const isValid = await validateEvent(eventIdParam);

  if (!isValid) {
    return notFound();
  }

  return <>{children}</>;
}
