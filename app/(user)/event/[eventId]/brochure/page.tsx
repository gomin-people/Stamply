'use client'

import { useState } from 'react'
import BrochureSlider from '@/components/user/brochure/BrochureSlider'
import BrochureIndicator from '@/components/user/brochure/BrochureIndicator'
import BrochureGuideOverlay from '@/components/user/brochure/BrochureGuideOverlay'

const images = [
  '/images/image_brochure.png',
  '/images/image_brochure2.png',
  '/images/image_brouchure3.png',
]

const BrochurePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showGuide, setShowGuide] = useState(true)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-white flex flex-col items-center pt-4 pb-10">
      <div className="mb-4">
        <BrochureIndicator total={images.length} currentIndex={currentIndex} />
      </div>
      <BrochureSlider
        images={images}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      {showGuide && <BrochureGuideOverlay onDismiss={() => setShowGuide(false)} />}
    </div>
  )
}

export default BrochurePage
