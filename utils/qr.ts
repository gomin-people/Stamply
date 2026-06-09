import { type QrScanTarget } from "@/types/qr-check";

export function svgToPng(
  svgElement: SVGElement,
  size: number,
  padding: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const svgStr = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvasSize = size + padding * 2;
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      ctx.drawImage(img, padding, padding, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG 변환 실패"));
    };
    img.src = url;
  });
}

type GetQrScanTargetOptions = {
  currentEventId?: string;
};

/**
 * 미션 검증을 위한 QR 코드 URL을 생성합니다.
 * @param token QR 토큰 값
 * @returns 도메인이 포함된 전체 URL
 */
export function getMissionCheckUrl(token: string): string {
  return `${getCurrentOrigin()}/api/v1/qr/mission-check/${token}`;
}

export function getEntryQrUrl(token: string): string {
  return `${getCurrentOrigin()}/api/v1/qr/entry/${token}`;
}

/**
 * 스캔된 문자열을 QR 처리 대상 URL로 변환합니다.
 *
 * 일반 문자열이 브라우저 기준 상대 경로로 변환되는 것을 막기 위해
 * 절대 URL 또는 /로 시작하는 앱 내부 경로만 URL로 인정합니다.
 *
 * @param value - QR 코드에서 읽은 원본 문자열
 * @returns QR 처리 대상으로 볼 수 있는 URL이면 URL 객체, 아니면 null
 */
const toQrUrl = (value: string) => {
  try {
    if (value.startsWith("/")) {
      return new URL(value, getCurrentOrigin());
    }

    return new URL(value);
  } catch {
    return null;
  }
};

/**
 * 현재 앱의 origin을 가져옵니다.
 *
 * @returns 브라우저에서는 현재 origin, 서버/테스트 환경에서는 기본 origin
 */
const getCurrentOrigin = () =>
  typeof window === "undefined" ? "http://localhost" : window.location.origin;

/**
 * 미션 체크 API URL에서 앱 내부 이동 경로를 만듭니다.
 *
 * @param url - QR 코드에서 파싱한 URL
 * @returns 미션 체크 URL이면 내부 이동 path, 아니면 null
 */
const getMissionCheckPath = (url: URL) => {
  if (!url.pathname.startsWith("/api/v1/qr/mission-check/")) return null;

  return `${url.pathname}${url.search}${url.hash}`;
};

/**
 * 행사 페이지 URL에서 앱 내부 이동 경로를 만듭니다.
 *
 * @param url - QR 코드에서 파싱한 URL
 * @param currentEventId - 현재 QR 스캔 화면의 행사 ID
 * @returns 행사 URL이면 내부 이동 path, 아니면 null
 */
const getEventPath = (url: URL, currentEventId?: string) => {
  if (!currentEventId) return null;
  if (url.origin !== getCurrentOrigin()) return null;
  if (url.search || url.hash) return null;

  const eventPath = `/event/${currentEventId}`;
  const normalizedPathname = url.pathname.endsWith("/")
    ? url.pathname.slice(0, -1)
    : url.pathname;

  if (normalizedPathname !== eventPath) return null;

  return eventPath;
};

/**
 * QR 원본 문자열에서 실제로 처리 가능한 앱 내부 이동 대상을 찾습니다.
 *
 * @param value - QR 코드에서 읽은 원본 문자열
 * @param options - QR 해석에 필요한 현재 화면 정보
 * @returns 지원하는 QR이면 이동 대상, 아니면 null
 */
export const getQrScanTarget = (
  value: string,
  { currentEventId }: GetQrScanTargetOptions = {}
): QrScanTarget | null => {
  const url = toQrUrl(value.trim());
  if (!url) return null;

  const missionCheckPath = getMissionCheckPath(url);
  if (missionCheckPath) {
    return {
      type: "missionCheck",
      path: missionCheckPath,
    };
  }

  const eventPath = getEventPath(url, currentEventId);
  if (eventPath) {
    return {
      type: "event",
      path: eventPath,
    };
  }

  return null;
};
