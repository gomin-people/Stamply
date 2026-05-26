'use client'

import Image from 'next/image'

type BrochureSliderProps = {
  images: string[]
  currentIndex: number
  onPrev: () => void
  onNext: () => void
}

const BrochureSlider = ({ images, currentIndex, onPrev, onNext }: BrochureSliderProps) => {
  return (
    <div className="relative w-78 h-168.5 rounded-[20px] overflow-hidden shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-300 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image src={src} alt={`브로셔 ${index + 1}`} fill sizes="312px" className="object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
        </div>
      ))}
      <button
        className="absolute left-0 top-0 w-1/2 h-full z-10"
        onClick={onPrev}
        aria-label="이전 페이지"
      />
      <button
        className="absolute right-0 top-0 w-1/2 h-full z-10"
        onClick={onNext}
        aria-label="다음 페이지"
      />
    </div>
  )
}

export default BrochureSlider
