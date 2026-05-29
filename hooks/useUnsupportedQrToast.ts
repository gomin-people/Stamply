import { useCallback, useEffect, useRef, useState } from 'react';
import { type UnsupportedQrToastState } from '@/types/qr-check';

/**
 * 지원하지 않는 QR 안내 토스트의 표시 여부와 자동 닫힘 타이머를 관리합니다.
 *
 * 같은 QR이 카메라에 계속 잡히면 qr-scanner가 반복해서 디코딩할 수 있습니다.
 * 그래서 토스트 애니메이션이 끝난 뒤 2초 쿨다운을 두어 연속 표시를 막습니다.
 */
export const useUnsupportedQrToast = () => {
  const enterTimeoutRef = useRef<number | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);
  const removeTimeoutRef = useRef<number | null>(null);
  const isToastLifecycleRunningRef = useRef(false);
  const nextToastAllowedAtRef = useRef(0);
  const [toast, setToast] = useState<UnsupportedQrToastState | null>(null);

  const clearToastTimers = useCallback(() => {
    // 언마운트나 재시작 전에 예약된 애니메이션 타이머를 모두 정리합니다.
    const timeoutRefs = [
      enterTimeoutRef,
      exitTimeoutRef,
      removeTimeoutRef,
    ];

    timeoutRefs.forEach((timeoutRef) => {
      if (timeoutRef.current === null) return;

      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    });
  }, []);

  const showUnsupportedQrToast = useCallback(() => {
    const now = Date.now();

    // 토스트가 표시/퇴장 중이거나 쿨다운 중이면 같은 QR 반복 인식을 무시합니다.
    if (
      isToastLifecycleRunningRef.current ||
      now < nextToastAllowedAtRef.current
    ) {
      return;
    }

    // 1. 사각형 아래에서 중앙으로 튀어나오는 등장 애니메이션을 시작합니다.
    isToastLifecycleRunningRef.current = true;
    clearToastTimers();
    setToast({
      animationState: 'entering',
      message: '지원하지 않는 QR입니다',
    });

    // 2. 등장 애니메이션이 끝나면 중앙에 고정된 visible 상태로 전환합니다.
    enterTimeoutRef.current = window.setTimeout(() => {
      setToast((currentToast) =>
        currentToast
          ? {
              ...currentToast,
              animationState: 'visible',
            }
          : currentToast
      );
      enterTimeoutRef.current = null;
    }, 400);

    const exitDelayMs = 400 + 1400;

    // 3. 중앙 유지 시간이 끝나면 다시 사각형 아래로 사라지는 퇴장 애니메이션을 시작합니다.
    exitTimeoutRef.current = window.setTimeout(() => {
      setToast((currentToast) =>
        currentToast
          ? {
              ...currentToast,
              animationState: 'exiting',
            }
          : currentToast
      );
      exitTimeoutRef.current = null;

      // 4. 퇴장 애니메이션이 끝난 뒤 DOM에서 제거하고, 다음 표시 가능 시간을 2초 뒤로 잡습니다.
      removeTimeoutRef.current = window.setTimeout(() => {
        setToast(null);
        removeTimeoutRef.current = null;
        isToastLifecycleRunningRef.current = false;
        nextToastAllowedAtRef.current = Date.now() + 2000;
      }, 300);
    }, exitDelayMs);
  }, [clearToastTimers]);

  useEffect(() => clearToastTimers, [clearToastTimers]);

  return {
    toast,
    showUnsupportedQrToast,
  };
};
