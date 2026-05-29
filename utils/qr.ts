import { type QrScanTarget } from "@/types/qr-check";

/**
 * 미션 검증을 위한 QR 코드 URL을 생성합니다.
 * @param token QR 토큰 값
 * @returns 도메인이 포함된 전체 URL
 */
export function getMissionCheckUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return `${baseUrl}/api/v1/qr/mission-check/${token}`;
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
      const baseUrl =
        typeof window === "undefined"
          ? "http://localhost"
          : window.location.origin;

      return new URL(value, baseUrl);
    }

    return new URL(value);
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
  if (!url.pathname.startsWith("/api/v1/qr/mission-check/")) return null;

  return `${url.pathname}${url.search}${url.hash}`;
};

/**
 * 행사 페이지 URL에서 앱 내부 이동 경로를 만듭니다.
 *
 * @param url - QR 코드에서 파싱한 URL
 * @returns 행사 URL이면 내부 이동 path, 아니면 null
 */
const getEventPath = (url: URL) => {
  if (!url.pathname.startsWith("/event/")) return null;
  return `${url.pathname}${url.search}${url.hash}`;
};

/**
 * QR 원본 문자열에서 실제로 처리 가능한 앱 내부 이동 대상을 찾습니다.
 *
 * @param value - QR 코드에서 읽은 원본 문자열
 * @returns 지원하는 QR이면 이동 대상, 아니면 null
 */
export const getQrScanTarget = (value: string): QrScanTarget | null => {
  const url = toQrUrl(value.trim());
  if (!url) return null;

  const missionCheckPath = getMissionCheckPath(url);
  if (missionCheckPath) {
    return {
      type: 'missionCheck',
      path: missionCheckPath,
    };
  }

  const eventPath = getEventPath(url);
  if (eventPath) {
    return {
      type: 'event',
      path: eventPath,
    };
  }

  return null;
};
