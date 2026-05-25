'use client'

import IconOverlayCircle from './IconOverlayCircle'

type BrochureGuideOverlayProps = {
  onDismiss: () => void
}

const BrochureGuideOverlay = ({ onDismiss }: BrochureGuideOverlayProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[rgba(17,17,17,0.5)]"
      onClick={onDismiss}
    >
      <div className="-translate-y-15 flex flex-col items-center">
        <p className="text-gomin-white font-bold text-2xl text-center leading-snug">
          터치해서 페이지 이동하기
        </p>
        <div className="flex items-center gap-20 mt-2">
          <IconOverlayCircle />
          <IconOverlayCircle />
        </div>
      </div>
    </div>
  )
}

export default BrochureGuideOverlay
