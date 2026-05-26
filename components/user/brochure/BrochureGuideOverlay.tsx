'use client'

import { useState } from 'react'
import OverlayCircleIcon from '@/components/icons/OverlayCircleIcon'

type BrochureGuideOverlayProps = {
  eventId: string
}

const BrochureGuideOverlay = ({ eventId }: BrochureGuideOverlayProps) => {
  const [visible, setVisible] = useState(
    !localStorage.getItem(`brochure-guide-seen-${eventId}`)
  )

  if (!visible) return null

  const handleDismiss = () => {
    localStorage.setItem(`brochure-guide-seen-${eventId}`, '1')
    setVisible(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(17,17,17,0.5)]"
      onClick={handleDismiss}
    >
      <div className="-translate-y-15 flex flex-col items-center">
        <p className="text-gomin-white font-bold text-2xl text-center leading-snug">
          터치해서 페이지 이동하기
        </p>
        <div className="flex items-center gap-20 mt-2">
          <OverlayCircleIcon />
          <OverlayCircleIcon />
        </div>
      </div>
    </div>
  )
}

export default BrochureGuideOverlay
