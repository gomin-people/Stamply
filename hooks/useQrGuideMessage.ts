import { useCallback, useEffect, useRef, useState } from "react";
import { type QrGuideMessageState } from "@/types/qr-check";

/**
 * QR 스캔 안내 말풍선에 일시 표시할 메시지와 자동 닫힘 타이머를 관리합니다.
 *
 * 같은 QR이 카메라에 계속 잡히면 qr-scanner가 반복해서 디코딩할 수 있습니다.
 * 그래서 안내가 사라진 뒤 2초 쿨다운을 두어 연속 표시를 막습니다.
 */
export const useQrGuideMessage = () => {
  const hideTimeoutRef = useRef<number | null>(null);
  const isGuideMessageVisibleRef = useRef(false);
  const nextGuideMessageAllowedAtRef = useRef(0);
  const [guideMessage, setGuideMessage] = useState<QrGuideMessageState | null>(
    null
  );

  const clearGuideMessageTimers = useCallback(() => {
    // 언마운트나 재시작 전에 예약된 안내 메시지 타이머를 정리합니다.
    if (hideTimeoutRef.current === null) return;

    window.clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = null;
  }, []);

  const showUnsupportedQrMessage = useCallback(() => {
    const now = Date.now();

    // 안내가 표시 중이거나 쿨다운 중이면 같은 QR 반복 인식을 무시합니다.
    if (
      isGuideMessageVisibleRef.current ||
      now < nextGuideMessageAllowedAtRef.current
    ) {
      return;
    }

    isGuideMessageVisibleRef.current = true;
    clearGuideMessageTimers();
    setGuideMessage({
      message: "지원하지 않는 QR입니다",
    });

    hideTimeoutRef.current = window.setTimeout(() => {
      setGuideMessage(null);
      hideTimeoutRef.current = null;
      isGuideMessageVisibleRef.current = false;
      nextGuideMessageAllowedAtRef.current = Date.now() + 2000;
    }, 1800);
  }, [clearGuideMessageTimers]);

  useEffect(() => clearGuideMessageTimers, [clearGuideMessageTimers]);

  return {
    guideMessage,
    showUnsupportedQrMessage,
  };
};
