'use client';

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import OverlayCircleIcon from '@/components/icons/OverlayCircleIcon'

const BrochureGuideOverlay = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const storageKey = `brochure-guide-seen-${eventId}`;
  const [visible, setVisible] = useState(!localStorage.getItem(storageKey));

  useEffect(() => {
    const prevent = (e: TouchEvent) => e.preventDefault()

    if (visible) {
      document.addEventListener('touchmove', prevent, { passive: false })
    }

    return () => {
      document.removeEventListener('touchmove', prevent)
    }
  }, [visible])

  const handleDismiss = () => {
    localStorage.setItem(storageKey, "1");
    setVisible(false);
  };

  return (
    visible && (
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
  );
};

export default BrochureGuideOverlay;
