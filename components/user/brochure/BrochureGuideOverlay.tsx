"use client";

import { useState, useEffect } from "react";
import OverlayCircleIcon from "@/components/icons/OverlayCircleIcon";

const BrochureGuideOverlay = ({ eventId }: { eventId: string }) => {
  const [visible, setVisible] = useState(
    () =>
      typeof window === "undefined" ||
      !document.cookie
        .split("; ")
        .some((c) => c.startsWith(`brochure-guide-seen-${eventId}=`))
  );

  useEffect(() => {
    const prevent = (e: TouchEvent) => e.preventDefault();
    if (visible) {
      document.addEventListener("touchmove", prevent, { passive: false });
    }
    return () => {
      document.removeEventListener("touchmove", prevent);
    };
  }, [visible]);

  const handleDismiss = () => {
    document.cookie = `brochure-guide-seen-${eventId}=1; path=/; max-age=31536000`;
    setVisible(false);
  };

  if (!visible) return null;

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
  );
};

export default BrochureGuideOverlay;
