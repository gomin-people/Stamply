'use client'

import { useState } from 'react'
import BrochureSlider from '@/components/user/brochure/BrochureSlider'
import BrochureIndicator from '@/components/user/brochure/BrochureIndicator'
import BrochureGuideOverlay from '@/components/user/brochure/BrochureGuideOverlay'
import BrochureEventButton from '@/components/user/brochure/BrochureEventButton'

type BrochureClientPageProps = {
  images: string[]
  eventId: string
  fromMission: boolean
}

const BrochureClientPage = ({ images, eventId, fromMission }: BrochureClientPageProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showGuide, setShowGuide] = useState(!fromMission)

  const handleDismiss = () => setShowGuide(false)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? prev : prev + 1))
  }

  return (
    <div className="bg-gomin-white flex flex-col items-center pt-4 pb-10">
      <div className="mb-4">
        <BrochureIndicator total={images.length} currentIndex={currentIndex} />
      </div>
      <BrochureSlider
        images={images}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      {showGuide && <BrochureGuideOverlay onDismiss={handleDismiss} />}
      {fromMission && <BrochureEventButton eventId={eventId} />}
    </div>
  )
}

export default BrochureClientPage
