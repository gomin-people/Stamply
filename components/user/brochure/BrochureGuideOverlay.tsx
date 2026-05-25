'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type BrochureGuideOverlayProps = {
  onDismiss: () => void
}

const BrochureGuideOverlay = ({ onDismiss }: BrochureGuideOverlayProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(17,17,17,0.5)]"
      onClick={onDismiss}
    >
      <div className="-translate-y-5 flex flex-col items-center">
        <p className="text-gomin-white font-bold text-2xl text-center leading-snug">
          터치해서 페이지 이동하기
        </p>
        <div className="flex items-center gap-34 mt-10">
          <ChevronLeft className="w-9.5 h-9.5 text-gomin-white" />
          <ChevronRight className="w-9.5 h-9.5 text-gomin-white" />
        </div>
      </div>
    </div>
  )
}

export default BrochureGuideOverlay
