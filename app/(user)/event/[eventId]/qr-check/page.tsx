'use client';

import QrScanner from 'qr-scanner';
import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCompleteMissionMutation } from '@/features/qr/mission-check/missionCheckMutations';

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
 * 미션 체크 API URL에서 미션 QR 토큰을 추출합니다.
 *
 * @param url - QR 코드에서 파싱한 URL
 * @returns 미션 체크 URL이면 token, 아니면 null
 */
const getMissionToken = (url: URL) => {
  const missionCheckPrefix = '/api/v1/qr/mission-check/';

  if (!url.pathname.startsWith(missionCheckPrefix)) return null;

  const token = url.pathname.slice(missionCheckPrefix.length);
  return token ? decodeURIComponent(token) : null;
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
 * 미션 QR을 스캔하고 QR 종류에 따라 미션 완료 또는 페이지 이동을 처리하는 화면입니다.
 */
export default function QrCheckPage() {
  const router = useRouter();
  const params = useParams<{ eventId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasScannedRef = useRef(false);
  const { mutate: completeMission } = useCompleteMissionMutation();

  useEffect(() => {
    if (!videoRef.current) return;

    let scanner: QrScanner | null = null;

    /**
     * 잘못된 QR 또는 처리 실패 후 다시 스캔할 수 있도록 스캐너를 재시작합니다.
     */
    const restartScanner = () => {
      hasScannedRef.current = false;
      scanner?.start().catch((error) => {
        console.error('QR scanner start failed:', error);
      });
    };

    scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (hasScannedRef.current || !scanner) return;

        hasScannedRef.current = true;
        scanner.stop();

        const url = toQrUrl(result.data.trim());
        if (!url) {
          console.error('Invalid QR data:', result.data);
          restartScanner();
          return;
        }

        const missionToken = getMissionToken(url);
        if (missionToken) {
          completeMission(missionToken, {
            onSuccess: () => {
              router.replace(`/event/${params.eventId}/mission`);
            },
            onError: (error) => {
              console.error('Mission QR check failed:', error);
              restartScanner();
            },
          });
          return;
        }

        const eventPath = getEventPath(url);
        if (eventPath) {
          router.push(eventPath);
          return;
        }

        console.error('Unsupported QR data:', result.data);
        restartScanner();
      },
      {
        preferredCamera: 'environment',
        highlightScanRegion: false,
        highlightCodeOutline: false,
        onDecodeError: (error) => {
          if (isQrNotFoundError(error)) return;
          console.error('QR scanner error:', error);
        },
      }
    );

    scanner.start().catch((error) => {
      console.error('QR scanner start failed:', error);
    });

    return () => {
      scanner?.stop();
      scanner?.destroy();
    };
  }, [completeMission, params.eventId, router]);

  return (
    <>
      <div className="relative -mt-14 h-svh overflow-hidden bg-gomin-black text-gomin-white">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-full max-w-md">
            <div
              className="relative mx-auto aspect-square w-72 max-w-[78vw] rounded-t-lg border-4 bg-gomin-black/10"
              style={{ borderColor: 'var(--primary-700)' }}
            />
            <h2 className="mx-auto max-w-72 px-2 text-md font-extrabold leading-snug tracking-normal text-gomin-black shadow-lg backdrop-blur-sm rounded-b-lg">
              미션 QR 코드를 화면 중앙에 맞춰주세요
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
