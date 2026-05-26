import { notFound } from 'next/navigation'
import { supabase } from '@/utils/supabase/server'
import MissionPageClient from '@/components/user/MissionPageClient'

interface PageProps {
  params: Promise<{ eventId: string }>
}

export default async function MissionPage({ params }: PageProps) {
  const { eventId: eventIdParam } = await params
  const eventId = Number(eventIdParam)

  // 1. 이미 layout.tsx에서 유효한 이벤트 ID 및 존재 유무가 완전히 검증되었습니다.
  // 여기서는 미션 보드에서 필요한 실제 DB 데이터를 정확하게 가져옵니다.
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) {
    return notFound()
  }

  return <MissionPageClient event={event} eventId={eventIdParam} />
}


