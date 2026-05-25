'use client'

import { useState } from 'react'
import { use } from 'react'
import BrochureSlider from '@/components/user/brochure/BrochureSlider'
import BrochureIndicator from '@/components/user/brochure/BrochureIndicator'
import BrochureGuideOverlay from '@/components/user/brochure/BrochureGuideOverlay'

const images = [
  '/images/image_brochure.png',
  '/images/image_brochure2.png',
  '/images/image_brouchure3.png'
]

type PageProps = {
  params: Promise<{ eventId: string }>
}

const BrochurePage = ({ params }: PageProps) => {
  const { eventId } = use(params)
  const storageKey = `brochure_guide_seen_${eventId}`

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showGuide, setShowGuide] = useState(() => !localStorage.getItem(storageKey))

  const handleDismiss = () => {
    localStorage.setItem(storageKey, '1')
    setShowGuide(false)
  }

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
    </div>
  )
}

export default BrochurePage
