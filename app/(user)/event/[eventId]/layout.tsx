import { notFound } from 'next/navigation';
import { supabase } from '@/utils/supabase/server';
import { ThemeInitializer } from '@/components/user/common/ThemeInitializer';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}

export default async function EventLayout({ children, params }: LayoutProps) {
  const { eventId: eventIdParam } = await params;
  const eventId = Number(eventIdParam);

  if (isNaN(eventId) || eventId <= 0) {
    return notFound();
  }

  // Supabase를 통해 행사의 존재 여부 검증 및 테마 색상(primary_color)을 단일 쿼리로 동시 조회합니다.
  const { data: event, error } = await supabase
    .from('events')
    .select('primary_color')
    .eq('id', eventId)
    .maybeSingle();

  if (error || !event) {
    return notFound();
  }

  const primaryColor = event.primary_color || '#5435EB';

  return (
    <>
      <ThemeInitializer primaryColor={primaryColor} />
      {children}
    </>
  );
}
