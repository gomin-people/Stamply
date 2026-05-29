'use client';

import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type QrCheckClientProps = {
  eventId: string;
};

type CreateQrScannerParams = {
  video: HTMLVideoElement;
  onDecode: (result: QrScanner.ScanResult) => void;
};

type HandleQrScanResultParams = {
  result: QrScanner.ScanResult;
  scanner: QrScanner | null;
  hasScanned: boolean;
  markScanned: () => void;
  navigateToEvent: (path: string) => void;
  restartScanner: () => void;
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
 * 스캔된 문자열을 URL 객체로 변환합니다.
 *
 * @param value - QR 코드에서 읽은 원본 문자열
 * @returns 유효한 URL이면 URL 객체, 아니면 null
 */
const toQrUrl = (value: string) => {
  try {
    return new URL(value, window.location.origin);
  } catch {
    return null;
  }
};

/**
 * 미션 체크 API URL에서 앱 내부 이동 경로를 만듭니다.
 *
 * @param url - QR 코드에서 파싱한 URL
 * @returns 미션 체크 URL이면 내부 이동 path, 아니면 null
 */
const getMissionCheckPath = (url: URL) => {
  const missionCheckPrefix = '/api/v1/qr/mission-check/';

  if (!url.pathname.startsWith(missionCheckPrefix)) return null;

  return `${url.pathname}${url.search}${url.hash}`;
};

/**
 * 행사 페이지 URL에서 앱 내부 이동 경로를 만듭니다.
 *
 * @param url - QR 코드에서 파싱한 URL
 * @returns 행사 URL이면 내부 이동 path, 아니면 null
 */
const getEventPath = (url: URL) => {
  if (!url.pathname.startsWith('/event/')) return null;
  return `${url.pathname}${url.search}${url.hash}`;
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
  markScanned,
  navigateToEvent,
  restartScanner,
}: HandleQrScanResultParams) => {
  if (hasScanned || !scanner) return;

  markScanned();
  scanner.stop();

  const url = toQrUrl(result.data.trim());
  if (!url) {
    console.error('Invalid QR data:', result.data);
    restartScanner();
    return;
  }

  const missionCheckPath = getMissionCheckPath(url);
  if (missionCheckPath) {
    window.location.assign(missionCheckPath);
    return;
  }

  const eventPath = getEventPath(url);
  if (eventPath) {
    navigateToEvent(eventPath);
    return;
  }

  console.error('Unsupported QR data:', result.data);
  restartScanner();
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
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [readyDotCount, setReadyDotCount] = useState(1);

  /**
   * 현재 행사 미션 페이지로 명시적으로 이동합니다.
   */
  const handleBack = () => {
    router.push(`/event/${eventId}/mission`);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    let scanner: QrScanner | null = null;
    let isMounted = true;

    /**
     * 잘못된 QR 또는 처리 실패 후 다시 스캔할 수 있도록 스캐너를 재시작합니다.
     */
    const restartScanner = () => {
      hasScannedRef.current = false;
      scanner?.start().catch((error) => {
        console.error('QR scanner start failed:', error);
      });
    };

    scanner = createQrScanner({
      video: videoRef.current,
      onDecode: (result) => {
        handleQrScanResult({
          result,
          scanner,
          hasScanned: hasScannedRef.current,
          markScanned: () => {
            hasScannedRef.current = true;
          },
          navigateToEvent: (eventPath) => {
            router.push(eventPath);
          },
          restartScanner,
        });
      },
    });

    scanner.start().catch((error) => {
      if (isMounted) {
        setIsCameraReady(false);
      }
      console.error('QR scanner start failed:', error);
    });

    return () => {
      isMounted = false;
      scanner?.stop();
      scanner?.destroy();
    };
  }, [router]);

  useEffect(() => {
    if (isCameraReady) return;

    // 카메라 준비 중 메시지의 점 개수를 0.3초마다 1, 2, 3, 1, ... 순으로 변경
    const intervalId = window.setInterval(() => {
      setReadyDotCount((currentCount) =>
        currentCount === 3 ? 1 : currentCount + 1
      );
    }, 300);

    return () => window.clearInterval(intervalId);
  }, [isCameraReady]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gomin-black text-gomin-white">
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full bg-gomin-black object-cover transition-opacity duration-200 ${
          isCameraReady ? 'opacity-100' : 'opacity-0'
        }`}
        muted
        playsInline
        onPlaying={() => setIsCameraReady(true)}
      />
      {!isCameraReady && (
        <p className="absolute inset-x-0 top-[calc(4rem+env(safe-area-inset-top))] px-6 text-center text-base font-bold text-gomin-white">
          카메라가 준비 중입니다
          <span className="inline-block w-[1.5em] text-left">
            {'.'.repeat(readyDotCount)}
          </span>
        </p>
      )}
      <div className="absolute left-1/2 top-1/2 w-72 max-w-[78vw] -translate-x-1/2 -translate-y-1/2">
        <div className="aspect-square rounded-lg border-4 border-gomin-primary-700" />
        <h2 className="absolute left-0 top-full mt-4 w-full text-center text-base font-bold leading-snug">
          미션 QR 코드를 화면 중앙에 맞춰주세요
        </h2>
      </div>
      <div className="absolute inset-x-0 bottom-[calc(3rem+env(safe-area-inset-bottom))] px-6">
        <div className="mx-auto w-72 max-w-[78vw]">
          <button
            className="max-w-none w-full h-14 rounded-[20px] text-white font-sans font-extrabold text-lg transition-all duration-300 active:scale-[0.97] hover:scale-[1.01] flex items-center justify-center gap-2"
            onClick={handleBack}
            style={{
              backgroundColor: 'var(--primary-700)',
            }}
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCheckClient;
