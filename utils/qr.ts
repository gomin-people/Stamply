/**
 * 미션 검증을 위한 QR 코드 URL을 생성합니다.
 * Next.js SSR 환경에서 window 에러가 발생하지 않도록 방어 코드가 포함되어 있습니다.
 * @param token QR 토큰 값
 * @returns 도메인이 포함된 전체 URL (서버 렌더링 시에는 빈 문자열)
 */
export function getMissionCheckUrl(token: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/api/v1/qr/mission-check/${token}`;
}
