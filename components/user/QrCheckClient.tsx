'use client';

import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQrGuideMessage } from '@/hooks/useQrGuideMessage';
import {
  type CameraStatus,
  type QrGuideMessageState,
} from '@/types/qr-check';
import { getQrScanTarget } from '@/utils/qr';

type CreateQrScannerParams = {
  video: HTMLVideoElement;
  onDecode: (result: QrScanner.ScanResult) => void;
};

type QrCheckClientProps = {
  eventId: string;
};

type HandleQrScanResultParams = {
  result: QrScanner.ScanResult;
  scanner: QrScanner | null;
  hasScanned: boolean;
  currentEventId: string;
  markScanned: () => void;
  navigateToEvent: (path: string) => void;
  showUnsupportedQrMessage: () => void;
};

type ScanGuideBubbleProps = {
  cameraStatus: CameraStatus;
  loadingDotCount: number;
  guideMessage: QrGuideMessageState | null;
};

const PRIMARY_700_BACKGROUND_STYLE = {
  backgroundColor: 'var(--primary-700)',
};

/**
 * QR 스캐너가 QR을 찾지 못한 정상 대기 상태인지 확인합니다.
 *
 * @param error - qr-scanner가 전달한 디코딩 에러
 * @returns QR 미검출 에러이면 true
 */
const isQrNotFoundError = (error: Error | string) => {
  const message = error instanceof Error ? error.message : error;
  return message.includes(QrScanner.NO_QR_CODE_FOUND);
};

/**
 * 카메라 시작 실패가 사용자 권한 거부 또는 브라우저 차단 때문인지 확인합니다.
 *
 * @param error - qr-scanner 시작 실패 에러
 * @returns 권한 거부로 볼 수 있으면 true
 */
const isCameraPermissionDeniedError = (error: unknown) => {
  const name = error instanceof Error ? error.name : '';
  const message = error instanceof Error ? error.message : String(error);

  return (
    name === 'NotAllowedError' ||
    name === 'PermissionDeniedError' ||
    name === 'SecurityError' ||
    /permission|denied|not allowed/i.test(message)
  );
};

/**
 * 브라우저가 제공하는 카메라 권한 상태를 QR 스캐너 화면 상태로 변환합니다.
 *
 * @returns 확인 가능한 카메라 권한 기반 초기 상태
 */
const getInitialCameraStatus = async (): Promise<CameraStatus> => {
  if (!navigator.permissions?.query) {
    return 'loading';
  }

  try {
    const permissionStatus = await navigator.permissions.query({
      name: 'camera' as PermissionName,
    });

    if (permissionStatus.state === 'denied') return 'denied';
    if (permissionStatus.state === 'granted') return 'loading';

    return 'loading';
  } catch {
    return 'loading';
  }
};

/**
 * QR 스캐너 인스턴스를 생성합니다.
 *
 * @param params - 스캔 대상 video 요소와 디코딩 성공 콜백
 * @returns qr-scanner 인스턴스
 */
const createQrScanner = ({ video, onDecode }: CreateQrScannerParams) =>
  new QrScanner(video, onDecode, {
    preferredCamera: 'environment',
    highlightScanRegion: false,
    highlightCodeOutline: false,
    onDecodeError: (error) => {
      if (isQrNotFoundError(error)) return;
      console.error('QR scanner error:', error);
    },
  });

/**
 * QR 스캔 결과를 해석해 미션 완료 API 또는 행사 페이지로 이동합니다.
 *
 * @param params - 스캔 결과 처리에 필요한 스캐너 상태와 라우터
 */
const handleQrScanResult = ({
  result,
  scanner,
  hasScanned,
  currentEventId,
  markScanned,
  navigateToEvent,
  showUnsupportedQrMessage,
}: HandleQrScanResultParams) => {
  if (hasScanned || !scanner) return;

  const scanTarget = getQrScanTarget(result.data, { currentEventId });
  if (!scanTarget) {
    showUnsupportedQrMessage();
    return;
  }

  // 지원하는 QR은 한 번만 처리해야 하므로 이동 직전에 스캐너 잠금 처리
  markScanned();
  scanner.stop();

  if (scanTarget.type === 'missionCheck') {
    window.location.assign(scanTarget.path);
    return;
  }

  navigateToEvent(scanTarget.path);
};

/**
 * 카메라/스캔 상태 안내를 QR 프레임 위 말풍선에 표시합니다.
 */
const ScanGuideBubble = ({
  cameraStatus,
  loadingDotCount,
  guideMessage,
}: ScanGuideBubbleProps) => {
  let guideContent: React.ReactNode = 'QR 코드를 스캔하세요';

  if (guideMessage) {
    guideContent = guideMessage.message;
  } else if (cameraStatus === 'loading') {
    guideContent = (
      <>
        카메라가 준비 중입니다
        <span className="inline-block w-[1.5em] text-left">
          {'.'.repeat(loadingDotCount)}
        </span>
      </>
    );
  } else if (cameraStatus === 'denied') {
    guideContent = '카메라 권한을 허용해주세요';
  } else if (cameraStatus === 'unavailable') {
    guideContent = '카메라를 사용할 수 없습니다';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasScannedRef = useRef(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('loading');
  const [loadingDotCount, setLoadingDotCount] = useState(1);
  const { guideMessage, showUnsupportedQrMessage } = useQrGuideMessage();
  const isCameraActive = cameraStatus === 'active';

  /**
   * 현재 행사 미션 페이지 이동
   */
  const handleBack = () => {
    router.push(`/event/${eventId}/mission`);
  };

  const handleVideoLoadedMetadata = () => {
    // 실제 프레임 표시 전까지 준비 상태 유지
    setCameraStatus((currentStatus) =>
      currentStatus === 'active' ? currentStatus : 'loading'
    );
  };

  const handleVideoPlaying = () => {
    setCameraStatus('active');
  };

  // 페이지가 마운트된 동안에만 스캐너 인스턴스와 카메라 스트림 유지
  useEffect(() => {
    if (!videoRef.current) return;

    let scanner: QrScanner | null = null;
    let isMounted = true;

    scanner = createQrScanner({
      video: videoRef.current,
      onDecode: (result) => {
        handleQrScanResult({
          result,
          scanner,
          hasScanned: hasScannedRef.current,
          currentEventId: eventId,
          markScanned: () => {
            hasScannedRef.current = true;
          },
          navigateToEvent: (eventPath) => {
            router.push(eventPath);
          },
          showUnsupportedQrMessage,
        });
      },
    });

    // 브라우저 권한 상태를 확인한 뒤 qr-scanner 시작
    const startScanner = async () => {
      // 1. 이미 거부된 권한이면 start()를 호출하지 않고 안내 문구만 보여줍니다.
      const initialCameraStatus = await getInitialCameraStatus();
      if (!isMounted) return;

      setCameraStatus(initialCameraStatus);
      if (initialCameraStatus === 'denied') return;

      // 2. start()에서 권한 요청과 실제 카메라 스트림 연결이 일어납니다.
      scanner?.start().catch((error) => {
        // 3. 시작 실패 원인에 따라 권한 거부와 사용 불가 상태를 구분합니다.
        if (isMounted) {
          setCameraStatus(
            isCameraPermissionDeniedError(error) ? 'denied' : 'unavailable'
          );
        }
        console.error('QR scanner start failed:', error);
      });
    };

    startScanner();

    return () => {
      isMounted = false;
      scanner?.stop();
      scanner?.destroy();
    };
  }, [eventId, router, showUnsupportedQrMessage]);

  useEffect(() => {
    if (cameraStatus !== 'loading') return;

    // 카메라 준비 중 메시지의 점 개수를 0.3초마다 1, 2, 3, 1, ... 순으로 변경
    const intervalId = window.setInterval(() => {
      setLoadingDotCount((currentCount) =>
        currentCount === 3 ? 1 : currentCount + 1
      );
    }, 300);

    return () => window.clearInterval(intervalId);
  }, [cameraStatus]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gomin-black text-gomin-white">
      {/* 카메라 영상 */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full bg-gomin-black object-cover transition-opacity duration-200 ${
          isCameraActive ? 'opacity-100' : 'opacity-0'
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
          loadingDotCount={loadingDotCount}
          guideMessage={guideMessage}
        />
        <div className="aspect-square rounded-lg border-4 border-gomin-primary-700" />
      </div>
      {/* 미션 페이지로 돌아가는 하단 버튼 */}
      <div className="absolute inset-x-0 bottom-[calc(3rem+env(safe-area-inset-bottom))] px-6">
        <div className="mx-auto w-72 max-w-[78vw]">
          <button
            className="max-w-none w-full h-14 rounded-[20px] text-white font-sans font-extrabold text-lg transition-all duration-300 active:scale-[0.97] hover:scale-[1.01] flex items-center justify-center gap-2"
            onClick={handleBack}
            style={PRIMARY_700_BACKGROUND_STYLE}
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCheckClient;
