"use client";

import type QrScanner from "qr-scanner";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQrGuideMessage } from "@/hooks/useQrGuideMessage";
import { useQrScanner } from "@/hooks/useQrScanner";
import { type CameraStatus, type QrGuideMessageState } from "@/types/qr-check";
import { getQrScanTarget } from "@/utils/qr";
import { completeMissionFromQr } from "./completeMissionFromQr";

type QrCheckClientProps = {
  eventId: string;
};

type HandleQrScanResultParams = {
  result: QrScanner.ScanResult;
  hasScanned: boolean;
  currentEventId: string;
  markScanned: () => void;
  navigateToEvent: (path: string) => void;
  releaseScanLockAfterMessage: () => void;
  setMissionChecking: (isChecking: boolean) => void;
  showQrGuideMessage: (message: string) => void;
  showUnsupportedQrMessage: () => void;
};

type ScanGuideBubbleProps = {
  cameraStatus: CameraStatus;
  isMissionChecking: boolean;
  loadingDotCount: number;
  guideMessage: QrGuideMessageState | null;
};

const PRIMARY_700_BACKGROUND_STYLE = {
  backgroundColor: "var(--primary-700)",
};
const SCAN_LOCK_RELEASE_DELAY_MS = 3800;

/**
 * QR 스캔 결과를 해석해 미션 완료 API 또는 행사 페이지로 이동합니다.
 *
 * @param params - 스캔 결과 처리에 필요한 스캐너 상태와 라우터
 */
const handleQrScanResult = async ({
  result,
  hasScanned,
  currentEventId,
  markScanned,
  navigateToEvent,
  releaseScanLockAfterMessage,
  setMissionChecking,
  showQrGuideMessage,
  showUnsupportedQrMessage,
}: HandleQrScanResultParams) => {
  if (hasScanned) return;

  const scanTarget = getQrScanTarget(result.data, { currentEventId });
  if (!scanTarget) {
    showUnsupportedQrMessage();
    return;
  }

  // 지원하는 QR은 한 번만 처리해야 하므로 처리 완료 전까지 추가 디코딩을 잠급니다.
  markScanned();

  if (scanTarget.type === "missionCheck") {
    setMissionChecking(true);
    const missionCheckResult = await completeMissionFromQr(scanTarget.path);

    if (missionCheckResult.type === "completed") {
      window.location.assign(
        `/event/${currentEventId}/mission?newMission=${missionCheckResult.missionId}`
      );
      return;
    }

    if (missionCheckResult.type === "qrRequired") {
      window.location.assign("/qr-required");
      return;
    }

    if (missionCheckResult.type === "missionUnavailable") {
      window.location.assign(missionCheckResult.path);
      return;
    }

    setMissionChecking(false);
    showQrGuideMessage(missionCheckResult.message);
    releaseScanLockAfterMessage();
    return;
  }

  navigateToEvent(scanTarget.path);
};

/**
 * 카메라/스캔 상태 안내를 QR 프레임 위 말풍선에 표시합니다.
 */
const ScanGuideBubble = ({
  cameraStatus,
  isMissionChecking,
  loadingDotCount,
  guideMessage,
}: ScanGuideBubbleProps) => {
  let guideContent: React.ReactNode = "QR 코드를 스캔하세요";

  if (guideMessage) {
    guideContent = guideMessage.message;
  } else if (isMissionChecking) {
    guideContent = (
      <>
        미션 확인 중
        <span className="inline-block w-[1.5em] text-left">
          {".".repeat(loadingDotCount)}
        </span>
      </>
    );
  } else if (cameraStatus === "loading") {
    guideContent = (
      <>
        카메라가 준비 중입니다
        <span className="inline-block w-[1.5em] text-left">
          {".".repeat(loadingDotCount)}
        </span>
      </>
    );
  } else if (cameraStatus === "denied") {
    guideContent = "카메라 권한을 허용해주세요";
  } else if (cameraStatus === "unavailable") {
    guideContent = "카메라를 사용할 수 없습니다";
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-8 w-full -translate-x-1/2"
      role="status"
    >
      <div
        className="relative flex h-14 items-center justify-center rounded-[20px] px-5 text-center text-lg font-extrabold leading-tight text-gomin-white shadow-card"
        style={PRIMARY_700_BACKGROUND_STYLE}
      >
        <span className="relative z-10">{guideContent}</span>
        <span
          aria-hidden="true"
          className="absolute bottom-[-0.55rem] left-1/2 h-5 w-5 -translate-x-1/2 rotate-45"
          style={PRIMARY_700_BACKGROUND_STYLE}
        />
      </div>
    </div>
  );
};

/**
 * 미션 QR을 스캔하고 QR 종류에 따라 미션 완료 또는 페이지 이동을 처리하는 화면입니다.
 *
 * @param props - QR 스캔 화면에 필요한 현재 행사 정보
 * @returns QR 스캔 클라이언트 화면
 */
const QrCheckClient = ({ eventId }: QrCheckClientProps) => {
  const router = useRouter();
  const hasScannedRef = useRef(false);
  const isBackNavigatingRef = useRef(false);
  const releaseScanLockTimeoutRef = useRef<number | null>(null);
  const [isMissionChecking, setIsMissionChecking] = useState(false);
  const [isBackNavigating, setIsBackNavigating] = useState(false);
  const [loadingDotCount, setLoadingDotCount] = useState(1);
  const { guideMessage, showQrGuideMessage, showUnsupportedQrMessage } =
    useQrGuideMessage();

  /**
   * 현재 행사 미션 페이지 이동
   */
  const handleBack = () => {
    if (isBackNavigatingRef.current) return;

    isBackNavigatingRef.current = true;
    setIsBackNavigating(true);
    router.back();
  };

  const clearReleaseScanLockTimer = useCallback(() => {
    if (releaseScanLockTimeoutRef.current === null) return;

    window.clearTimeout(releaseScanLockTimeoutRef.current);
    releaseScanLockTimeoutRef.current = null;
  }, []);

  const releaseScanLockAfterMessage = useCallback(() => {
    clearReleaseScanLockTimer();
    releaseScanLockTimeoutRef.current = window.setTimeout(() => {
      releaseScanLockTimeoutRef.current = null;
      hasScannedRef.current = false;
    }, SCAN_LOCK_RELEASE_DELAY_MS);
  }, [clearReleaseScanLockTimer]);

  useEffect(() => {
    return () => {
      clearReleaseScanLockTimer();
    };
  }, [clearReleaseScanLockTimer]);

  const handleQrDecode = useCallback(
    (result: QrScanner.ScanResult) => {
      void handleQrScanResult({
        result,
        hasScanned: hasScannedRef.current,
        currentEventId: eventId,
        markScanned: () => {
          hasScannedRef.current = true;
        },
        navigateToEvent: (eventPath) => {
          router.push(eventPath);
        },
        releaseScanLockAfterMessage,
        setMissionChecking: setIsMissionChecking,
        showQrGuideMessage,
        showUnsupportedQrMessage,
      });
    },
    [
      eventId,
      releaseScanLockAfterMessage,
      router,
      showQrGuideMessage,
      showUnsupportedQrMessage,
    ]
  );

  const {
    cameraStatus,
    handleVideoLoadedMetadata,
    handleVideoPlaying,
    setVideoRef,
  } = useQrScanner({
    errorLogLabel: "QR scanner",
    onDecode: handleQrDecode,
    preferredCamera: "environment",
  });
  const isCameraActive = cameraStatus === "active";

  useEffect(() => {
    if (cameraStatus !== "loading" && !isMissionChecking) return;

    // 카메라 준비/미션 확인 중 메시지의 점 개수를 0.3초마다 1, 2, 3, 1, ... 순으로 변경
    const intervalId = window.setInterval(() => {
      setLoadingDotCount((currentCount) =>
        currentCount === 3 ? 1 : currentCount + 1
      );
    }, 300);

    return () => window.clearInterval(intervalId);
  }, [cameraStatus, isMissionChecking]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gomin-black text-gomin-white">
      {/* 카메라 영상 */}
      <video
        ref={setVideoRef}
        className={`absolute inset-0 h-full w-full bg-gomin-black object-cover transition-opacity duration-200 ${
          isCameraActive ? "opacity-100" : "opacity-0"
        }`}
        muted
        playsInline
        onLoadedMetadata={handleVideoLoadedMetadata}
        onPlaying={handleVideoPlaying}
      />
      {/* QR 스캔 기준 사각형 */}
      <div className="absolute left-1/2 top-1/2 w-72 max-w-[78vw] -translate-x-1/2 -translate-y-1/2">
        {/* 스캔/카메라 상태 안내 말풍선 */}
        <ScanGuideBubble
          cameraStatus={cameraStatus}
          isMissionChecking={isMissionChecking}
          loadingDotCount={loadingDotCount}
          guideMessage={guideMessage}
        />
        <div className="aspect-square rounded-lg border-4 border-gomin-primary-700" />
      </div>
      {/* 미션 페이지로 돌아가는 하단 버튼 */}
      <div className="absolute inset-x-0 bottom-[calc(3rem+env(safe-area-inset-bottom))] px-6">
        <div className="mx-auto w-72 max-w-[78vw]">
          <button
            className="max-w-none w-full h-14 rounded-[20px] text-white font-sans font-extrabold text-lg transition-all duration-300 active:scale-[0.97] hover:scale-[1.01] disabled:pointer-events-none disabled:opacity-80 flex items-center justify-center gap-2"
            disabled={isBackNavigating}
            onClick={handleBack}
            style={PRIMARY_700_BACKGROUND_STYLE}
          >
            {isBackNavigating ? "이동 중..." : "돌아가기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCheckClient;
