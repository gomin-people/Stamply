"use client";

import { useState, useRef } from "react";

export function useCelebration() {
  const [showCelebration, setShowCelebration] = useState(false);
  const hasAnimationFired = useRef(false);

  const handleStampReady = () => {
    if (hasAnimationFired.current) return;
    hasAnimationFired.current = true;

    setTimeout(() => setShowCelebration(true), 600);

    setTimeout(() => {
      import("canvas-confetti").then(({ default: confetti }) => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#4CAF50", "#FF9800", "#2196F3", "#E91E63", "#9C27B0"],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#4CAF50", "#FF9800", "#2196F3", "#E91E63", "#9C27B0"],
        });
      });
    }, 800);
  };

  return { showCelebration, handleStampReady };
}
