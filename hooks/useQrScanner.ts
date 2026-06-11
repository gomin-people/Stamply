"use client";

import QrScanner from "qr-scanner";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CameraStatus } from "@/types/qr-check";

type UseQrScannerParams = {
  enabled?: boolean;
  errorLogLabel?: string;
  onDecode: (result: QrScanner.ScanResult) => void;
  preferredCamera?: QrScanner.FacingMode | QrScanner.DeviceId;
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
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : String(error);

  return (
    name === "NotAllowedError" ||
    name === "PermissionDeniedError" ||
    name === "SecurityError" ||
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
    return "loading";
  }

  try {
    const permissionStatus = await navigator.permissions.query({
      name: "camera" as PermissionName,
    });

    if (permissionStatus.state === "denied") return "denied";

    return "loading";
  } catch {
    return "loading";
  }
};

/**
 * QR 스캔용 video 요소와 qr-scanner 생명주기를 관리합니다.
 *
 * @param params - 스캐너 활성 여부, 카메라 방향, 디코딩 콜백
 * @returns video callback ref와 카메라 상태
 */
export const useQrScanner = ({
  enabled = true,
  errorLogLabel = "QR scanner",
  onDecode,
  preferredCamera = "environment",
}: UseQrScannerParams) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoRefVersion, setVideoRefVersion] = useState(0);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("loading");

  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    setVideoRefVersion((version) => version + 1);
  }, []);

  const handleVideoLoadedMetadata = useCallback(() => {
    setCameraStatus((currentStatus) =>
      currentStatus === "active" ? currentStatus : "loading"
    );
  }, []);

  const handleVideoPlaying = useCallback(() => {
    setCameraStatus("active");
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const video = videoRef.current;

    if (!video) return;

    let isMounted = true;
    const scanner = new QrScanner(video, onDecode, {
      preferredCamera,
      highlightScanRegion: false,
      highlightCodeOutline: false,
      returnDetailedScanResult: true,
      onDecodeError: (error) => {
        if (isQrNotFoundError(error)) return;

        console.error(`${errorLogLabel} error:`, error);
      },
    });

    const startScanner = async () => {
      const initialCameraStatus = await getInitialCameraStatus();
      if (!isMounted) return;

      setCameraStatus(initialCameraStatus);
      if (initialCameraStatus === "denied") return;

      try {
        await scanner.start();
        if (isMounted) {
          setCameraStatus("active");
        }
      } catch (error) {
        if (isMounted) {
          setCameraStatus(
            isCameraPermissionDeniedError(error) ? "denied" : "unavailable"
          );
        }
        console.error(`${errorLogLabel} start failed:`, error);
      }
    };

    void startScanner();

    return () => {
      isMounted = false;
      scanner.stop();
      scanner.destroy();
    };
  }, [enabled, errorLogLabel, onDecode, preferredCamera, videoRefVersion]);

  return {
    cameraStatus,
    handleVideoLoadedMetadata,
    handleVideoPlaying,
    setVideoRef,
  };
};
