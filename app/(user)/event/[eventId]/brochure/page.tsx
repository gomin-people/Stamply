'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParticipantEventQuery } from '@/features/participant/events/participantEventQueries'
import BrochureSlider from '@/components/user/brochure/BrochureSlider'
import BrochureIndicator from '@/components/user/brochure/BrochureIndicator'
import BrochureGuideOverlay from '@/components/user/brochure/BrochureGuideOverlay'
import BrochureEventButton from '@/components/user/brochure/BrochureEventButton'

type PageProps = {
  params: Promise<{ eventId: string }>
  searchParams: Promise<{ from?: string }>
}

const BrochurePage = ({ params, searchParams }: PageProps) => {
  const { eventId } = use(params)
  const { from } = use(searchParams)
  const fromMission = from === 'mission'
  const router = useRouter()

  const { data: event } = useParticipantEventQuery(Number(eventId))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showGuide, setShowGuide] = useState(true)

  if (event && !event.brochureImageUrl?.length) {
    router.replace(`/event/${eventId}/mission`)
    return null
  }

  const images = event?.brochureImageUrl ?? []

  const handleDismiss = () => setShowGuide(false)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? prev : prev + 1))
  }

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
      {!fromMission && showGuide && <BrochureGuideOverlay onDismiss={handleDismiss} />}
      {fromMission && <BrochureEventButton eventId={eventId} />}
    </div>
  )
}

export default BrochurePage
