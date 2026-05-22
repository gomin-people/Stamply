import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/utils/supabase/server'

interface PageProps {
  params: Promise<{ eventId: string }>
}

export default async function EventPage({ params }: PageProps) {
  const { eventId: eventIdParam } = await params
  const eventId = Number(eventIdParam)

  // 1. 이미 layout.tsx에서 ID 유효성 및 DB 존재 여부가 철저하게 검증되었습니다.
  // 여기서는 화면에 표시할 실제 데이터를 간결하게 가져옵니다.
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) {
    return notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-[calc(100vh-56px)] bg-gomin-white">
      <div className="max-w-md w-full space-y-6">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-gomin-primary-700 bg-gomin-primary-100 rounded-full">
            실시간 이벤트 연동
          </span>
          <h2 className="text-2xl font-black text-gomin-black">
            {event.title || event.name || `이벤트 #${eventId}`}
          </h2>
          <p className="text-sm text-gomin-neutral-500 whitespace-pre-line">
            {event.description || '즐거운 이벤트에 참여하고 스탬프를 모아보세요!\n아래 버튼을 눌러 안내장(브로슈어)을 확인하고 챌린지를 시작할 수 있습니다.'}
          </p>
        </div>

        <div className="pt-4">
          <Link
            href={`/event/${eventIdParam}/brochure`}
            className="inline-flex w-full items-center justify-center h-12 px-6 font-bold text-white bg-gomin-primary-700 hover:bg-gomin-primary-600 rounded-xl transition-all duration-200 shadow-md shadow-gomin-primary-700/20 active:scale-[0.98]"
          >
            브로슈어 보러가기
          </Link>
        </div>
      </div>
    </div>
  )
}
