import QrScanner from "qr-scanner";

/**
 * QR 스캐너가 QR을 찾지 못한 정상 대기 상태인지 확인합니다.
 *
 * @param error - qr-scanner가 전달한 디코딩 에러
 * @returns QR 미검출 에러이면 true
 */
export const isQrNotFoundError = (error: Error | string) => {
  const message = error instanceof Error ? error.message : error;
  return message.includes(QrScanner.NO_QR_CODE_FOUND);
};

/**
 * 카메라 시작 실패가 사용자 권한 거부 또는 브라우저 차단 때문인지 확인합니다.
 *
 * @param error - qr-scanner 시작 실패 에러
 * @returns 권한 거부로 볼 수 있으면 true
 */
export const isCameraPermissionDeniedError = (error: unknown) => {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : String(error);

  return (
    name === "NotAllowedError" ||
    name === "PermissionDeniedError" ||
    name === "SecurityError" ||
    /permission|denied|not allowed/i.test(message)
  );
};

export const getUserUnavailablePath = (message: string | null) =>
  message === "존재하지 않는 미션입니다."
    ? "/user-unavailable?reason=not-found"
    : "/user-unavailable";
