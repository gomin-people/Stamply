"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils";

const AUTO_SCROLL_TEXT_ANIMATION = {
  initialDelayMs: 500, // hover 후 스크롤 애니메이션을 시작하기 전 대기 시간
  endPauseMs: 500, // 텍스트가 끝까지 이동한 뒤 유지되는 시간
  startPauseMs: 500, // 처음 위치로 돌아온 뒤 다음 이동 전 대기 시간
  speedPxPerSecond: 30, // 텍스트가 1초 동안 이동하는 픽셀 거리
} as const;

type Props = {
  active: boolean;
  children: ReactNode;
  className?: string;
};

type AnimatedTextProps = {
  children: ReactNode;
  scrollDistance: number;
};

/**
 * 제한된 너비 안에서 긴 텍스트를 기본 말줄임표로 보여주고,
 * active 상태일 때만 일정 지연 후 marquee 형태로 반복 스크롤합니다.
 *
 * @param props - 활성 상태, 표시할 텍스트, 컨테이너 className
 * @returns overflow 텍스트 자동 스크롤 컴포넌트
 */
export const AutoScrollText = ({ active, children, className }: Props) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  // 1. 렌더링 영역과 원본 텍스트 폭을 비교해 실제로 이동해야 할 거리를 계산합니다.
  useEffect(() => {
    const container = containerRef.current;
    const measureText = measureRef.current;

    if (!container || !measureText) {
      return;
    }

    const measureOverflow = () => {
      setScrollDistance(
        Math.max(0, Math.ceil(measureText.scrollWidth - container.clientWidth))
      );
    };

    measureOverflow();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measureOverflow);

      return () => window.removeEventListener("resize", measureOverflow);
    }

    const resizeObserver = new ResizeObserver(measureOverflow);
    resizeObserver.observe(container);
    resizeObserver.observe(measureText);

    return () => resizeObserver.disconnect();
  }, [children]);

  return (
    <span
      ref={containerRef}
      className={cn(
        "relative block min-w-0 overflow-hidden whitespace-nowrap",
        className
      )}
    >
      {/* 2. 기본 상태는 truncate 레이어를 쓰고, active 상태에서는 지연/애니메이션 레이어를 마운트합니다. */}
      {active && scrollDistance > 0 ? (
        <AutoScrollAnimatedText scrollDistance={scrollDistance}>
          {children}
        </AutoScrollAnimatedText>
      ) : (
        <span className="block truncate">{children}</span>
      )}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="invisible pointer-events-none absolute top-0 left-0 whitespace-nowrap"
      >
        {children}
      </span>
    </span>
  );
};

const AutoScrollAnimatedText = ({
  children,
  scrollDistance,
}: AnimatedTextProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isAnimationReady, setIsAnimationReady] = useState(false);

  // 3. active 상태로 마운트되면 초기 지연 후 스크롤 가능한 텍스트 레이어로 전환합니다.
  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setIsAnimationReady(true),
      AUTO_SCROLL_TEXT_ANIMATION.initialDelayMs
    );

    return () => window.clearTimeout(timeoutId);
  }, []);

  // 4. 이동, 끝 대기, 즉시 복귀, 시작 대기를 하나의 keyframe cycle로 만들어 반복합니다.
  useEffect(() => {
    const text = textRef.current;

    if (!isAnimationReady || !text) {
      return;
    }

    text.style.transform = "translateX(0)";

    const moveDurationMs =
      (scrollDistance / AUTO_SCROLL_TEXT_ANIMATION.speedPxPerSecond) * 1000;
    const loopDurationMs =
      moveDurationMs +
      AUTO_SCROLL_TEXT_ANIMATION.endPauseMs +
      AUTO_SCROLL_TEXT_ANIMATION.startPauseMs;
    const moveEndOffset = moveDurationMs / loopDurationMs;
    const endPauseOffset =
      (moveDurationMs + AUTO_SCROLL_TEXT_ANIMATION.endPauseMs) / loopDurationMs;
    const resetOffset = Math.min(endPauseOffset + 0.0001, 0.9999);

    const animation = text.animate(
      [
        { transform: "translateX(0)", offset: 0 },
        {
          transform: `translateX(-${scrollDistance}px)`,
          offset: moveEndOffset,
        },
        {
          transform: `translateX(-${scrollDistance}px)`,
          offset: endPauseOffset,
        },
        { transform: "translateX(0)", offset: resetOffset },
        { transform: "translateX(0)", offset: 1 },
      ],
      {
        duration: loopDurationMs,
        easing: "linear",
        iterations: Infinity,
      }
    );

    return () => {
      animation.cancel();
      text.style.transform = "translateX(0)";
    };
  }, [isAnimationReady, scrollDistance]);

  if (!isAnimationReady) {
    return <span className="block truncate">{children}</span>;
  }

  return (
    <span ref={textRef} className="inline-block whitespace-nowrap">
      {children}
    </span>
  );
};
