"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { formatNumber } from "@/utils";

const INITIAL_COUNT_UPDATE_INTERVAL_MS = 80; // 초기 count-up 중 화면 숫자를 갱신하는 최소 간격
const MIN_INITIAL_COUNT_DURATION = 0.7; // 작은 숫자도 너무 급하게 끝나지 않도록 보장하는 최소 시간
const MAX_INITIAL_COUNT_DURATION = 1.8; // 큰 숫자 count-up이 지나치게 길어지지 않도록 제한하는 최대 시간
const INITIAL_COUNT_DURATION_BASE = 0.4; // 숫자 크기 기반 duration 계산의 기본 시간
const INITIAL_COUNT_DURATION_SCALE = 0.35; // log10(value)에 곱해지는 duration 증가량
const INITIAL_DIGIT_ROLL_DURATION = 0.16; // 초기 count-up 중 각 자리 롤링 시간
const UPDATE_DIGIT_ROLL_DURATION = 0.8; // 초기 이후 값 변경 시 각 자리 롤링 시간

type Props = {
  value: number;
  ready?: boolean;
  format?: (value: number) => string;
};

type NumberPart =
  | {
      char: string;
      key: string;
      type: "digit";
    }
  | {
      char: string;
      key: string;
      type: "separator";
    };

type DigitSlotState = {
  currentChar: string;
  previousChar: string | null;
  transitionId: number;
};

// 초기 count-up 시간은 숫자 크기에 따라 자연스럽게 늘리되, 최소/최대 시간을 제한합니다.
const getInitialCountDuration = (value: number) => {
  if (value <= 0) {
    return 0;
  }

  return Math.min(
    MAX_INITIAL_COUNT_DURATION,
    Math.max(
      MIN_INITIAL_COUNT_DURATION,
      INITIAL_COUNT_DURATION_BASE +
        Math.log10(value + 1) * INITIAL_COUNT_DURATION_SCALE
    )
  );
};

const getNumberParts = (value: string): NumberPart[] => {
  const chars = Array.from(value);
  let digitPlace = 0;
  const reversedParts: NumberPart[] = [];

  // 숫자 자리는 오른쪽부터 place를 부여해 9 -> 10 같은 자릿수 증가에서도 1의 자리 위치를 유지합니다.
  for (let index = chars.length - 1; index >= 0; index -= 1) {
    const char = chars[index];

    if (/\d/.test(char)) {
      reversedParts.push({
        char,
        key: `digit-place-${digitPlace}`,
        type: "digit",
      });
      digitPlace += 1;
      continue;
    }

    reversedParts.push({
      char,
      key: `separator-${char}-${digitPlace}`,
      type: "separator",
    });
  }

  return reversedParts.reverse();
};

const AnimatedNumber = ({
  value,
  ready = true,
  format = formatNumber,
}: Props) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasCompletedInitialAnimation, setHasCompletedInitialAnimation] =
    useState(false);
  const latestValueRef = useRef(0);
  const hasAnimatedInitialValueRef = useRef(false);
  const displayText = format(displayValue);
  const targetText = format(value);

  // 1. 실제 데이터가 준비된 뒤 초기 count-up과 이후 값 변경을 각각 다른 방식으로 처리합니다.
  useEffect(() => {
    if (!ready) {
      return;
    }

    const from = latestValueRef.current;
    const to = value;
    const isInitialAnimation = !hasAnimatedInitialValueRef.current;

    if (from === to) {
      // 이전 값과 새 값이 같아 실제로 애니메이션할 숫자 변화가 없는 경우
      hasAnimatedInitialValueRef.current = true;
      setHasCompletedInitialAnimation(true);
      return;
    }

    if (!isInitialAnimation) {
      // 초기 count-up 이후 KPI 값이 다시 변경된 경우
      latestValueRef.current = to;
      setDisplayValue(to);
      return;
    }

    let lastDisplayUpdateTime = 0;

    // 2. 초기 count-up은 숫자 크기에 맞춘 duration을 쓰고, 화면 갱신 빈도를 제한해 1의 자리 떨림을 줄입니다.
    const controls = animate(from, to, {
      duration: getInitialCountDuration(to),
      ease: "easeOut",
      onUpdate: (latest) => {
        const roundedLatest = Math.round(latest);
        const now = performance.now();

        if (
          roundedLatest !== to &&
          now - lastDisplayUpdateTime < INITIAL_COUNT_UPDATE_INTERVAL_MS
        ) {
          return;
        }

        lastDisplayUpdateTime = now;
        latestValueRef.current = roundedLatest;
        setDisplayValue(roundedLatest);
      },
      onComplete: () => {
        latestValueRef.current = to;
        hasAnimatedInitialValueRef.current = true;
        setDisplayValue(to);
        setHasCompletedInitialAnimation(true);
      },
    });

    return () => controls.stop();
  }, [ready, value]);

  return (
    <DigitRoller
      value={displayText}
      minCharacterCount={Math.max(displayText.length, targetText.length)}
      rollDuration={
        hasCompletedInitialAnimation
          ? UPDATE_DIGIT_ROLL_DURATION
          : INITIAL_DIGIT_ROLL_DURATION
      }
    />
  );
};

// 포맷된 숫자 문자열을 자리별 고정 폭 칸으로 나누고, 숫자 칸만 롤링 애니메이션으로 렌더링
const DigitRoller = ({
  value,
  minCharacterCount,
  rollDuration,
}: {
  value: string;
  minCharacterCount: number;
  rollDuration: number;
}) => {
  const parts = getNumberParts(value);

  return (
    <span
      className="inline-flex items-baseline justify-end tabular-nums"
      style={{ minWidth: `${minCharacterCount * 0.62}em` }}
    >
      {parts.map((part) => {
        if (part.type === "separator") {
          return (
            <span key={part.key} className="inline-block px-[0.03em]">
              {part.char}
            </span>
          );
        }

        return (
          <DigitSlot
            key={part.key}
            char={part.char}
            rollDuration={rollDuration}
          />
        );
      })}
    </span>
  );
};

const DigitSlot = ({
  char,
  rollDuration,
}: {
  char: string;
  rollDuration: number;
}) => {
  const [slotState, setSlotState] = useState<DigitSlotState>({
    currentChar: char,
    previousChar: null,
    transitionId: 0,
  });
  const hasChanged = slotState.previousChar !== null;

  // 숫자 칸을 unmount하지 않고 이전/현재 숫자 strip을 움직여 전환 중 빈 칸이 생기지 않게 합니다.
  useEffect(() => {
    if (slotState.currentChar === char) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setSlotState((current) => {
        if (current.currentChar === char) {
          return current;
        }

        return {
          currentChar: char,
          previousChar: current.currentChar,
          transitionId: current.transitionId + 1,
        };
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [char, slotState.currentChar]);

  const clearPreviousChar = (transitionId: number) => {
    setSlotState((current) => {
      if (current.transitionId !== transitionId) {
        return current;
      }

      return {
        ...current,
        previousChar: null,
      };
    });
  };

  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-baseline leading-none">
      {hasChanged ? (
        <motion.span
          key={slotState.transitionId}
          className="absolute inset-x-0 top-0 flex flex-col text-center"
          initial={{ y: "0%" }}
          animate={{ y: "-50%" }}
          transition={{ duration: rollDuration, ease: "easeOut" }}
          onAnimationComplete={() => clearPreviousChar(slotState.transitionId)}
        >
          <span className="h-[1em] leading-none">{slotState.previousChar}</span>
          <span className="h-[1em] leading-none">{slotState.currentChar}</span>
        </motion.span>
      ) : (
        <span className="absolute inset-x-0 top-0 text-center">
          {slotState.currentChar}
        </span>
      )}
    </span>
  );
};

export default AnimatedNumber;
