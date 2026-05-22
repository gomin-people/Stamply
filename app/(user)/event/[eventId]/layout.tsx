import { notFound } from 'next/navigation';
import { supabase } from '@/utils/supabase/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}

export default async function EventLayout({ children, params }: LayoutProps) {
  const { eventId: eventIdParam } = await params;
  const eventId = Number(eventIdParam);

  // 1. eventId가 올바른 숫자인지 검증합니다.
  if (isNaN(eventId) || eventId <= 0) {
    return notFound();
  }

  // 2. Supabase에서 해당 행사 데이터가 실제로 존재하는지 유효성 검증을 합니다.
  let eventExists = false;
  try {
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .maybeSingle();

    if (!error && data) {
      eventExists = true;
    }
  } catch (err) {
    console.error('Supabase validation error in layout:', err);
  }

  // 존재하지 않는 이벤트라면 하위 페이지 렌더링을 차단하고 404를 반환합니다.
  if (!eventExists) {
    return notFound();
  }

  return <>{children}</>;
}
