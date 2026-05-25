'use client'

import { useRouter } from 'next/navigation'

type BrochureEventButtonProps = {
  eventId: string
}

const BrochureEventButton = ({ eventId }: BrochureEventButtonProps) => {
  const router = useRouter()

  return (
    <button
      className="fixed bottom-10 left-1/2 -translate-x-1/2 w-71.75 h-10.75 bg-gomin-neutral-600 rounded-[20px] text-gomin-white font-bold text-sm"
      onClick={() => router.push(`/event/${eventId}`)}
    >
      행사 상세 정보
    </button>
  )
}

export default BrochureEventButton
