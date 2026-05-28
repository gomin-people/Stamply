'use client'

import { useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useParticipantEventQuery } from '@/features/participant/events/participantEventQueries'
import BrochureSlider from '@/components/user/brochure/BrochureSlider'
import BrochureIndicator from '@/components/user/brochure/BrochureIndicator'
import BrochureEventButton from '@/components/user/brochure/BrochureEventButton'
import ThemedButton from '@/components/user/common/ThemedButton'

const BrochureGuideOverlay = dynamic(
  () => import('@/components/user/brochure/BrochureGuideOverlay'),
  { ssr: false }
)

const BrochurePage = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const searchParams = useSearchParams()
  const fromMission = searchParams.get('from') === 'mission'

  const router = useRouter()
  const { data: event } = useParticipantEventQuery(Number(eventId))
  const [currentIndex, setCurrentIndex] = useState(0)

  if (event && !event.brochureImageUrl?.length) {
    router.replace(`/event/${eventId}/mission`)
    return null
  }

  const images = event?.brochureImageUrl ?? []

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1))
  }

  const handleNext = () => {
    if (currentIndex === images.length - 1) {
      if (!fromMission) {
        router.push(`/event/${eventId}/mission`)
      }
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const isLastPage = images.length > 0 && currentIndex === images.length - 1

  return (
    <div className="bg-gomin-white flex flex-col items-center pt-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="mb-4">
        <BrochureIndicator total={images.length} currentIndex={currentIndex} />
      </div>
      <BrochureSlider
        images={images}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      
      {/* 3번 추가 구현: 최초 진입(fromMission = false)이고 브로슈어를 다 읽었을(마지막 슬라이드) 때 '스탬프 투어 시작하기' 버튼 활성화 */}
      {!fromMission && isLastPage && (
        <div className="mt-6 w-full max-w-76 px-4 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ThemedButton 
            className="w-full"
            onClick={() => router.push(`/event/${eventId}/mission`)}
          >
            스탬프 투어 시작하기
          </ThemedButton>
        </div>
      )}

      {!fromMission && <BrochureGuideOverlay />}
      {fromMission && <BrochureEventButton />}
    </div>
  )
}

export default BrochurePage
