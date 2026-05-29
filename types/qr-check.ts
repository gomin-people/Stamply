/**
 * QR 스캔 화면의 카메라 진행 상태입니다.
 *
 * - loading: 권한 확인, 스트림 연결, 첫 비디오 프레임 대기 중
 * - active: 비디오가 재생되어 스캔 화면을 보여줄 수 있는 상태
 * - denied: 사용자가 카메라 권한을 거부했거나 브라우저가 차단한 상태
 * - unavailable: 권한 문제 외의 이유로 카메라를 시작할 수 없는 상태
 */
export type CameraStatus = 'loading' | 'active' | 'denied' | 'unavailable';

/**
 * QR 원본 문자열에서 해석한 앱 내부 처리 대상입니다.
 */
export type QrScanTarget =
  | {
      type: 'missionCheck';
      path: string;
    }
  | {
      type: 'event';
      path: string;
    };

/**
 * 지원하지 않는 QR 토스트가 DOM에 남아 있는 동안의 애니메이션 단계입니다.
 */
export type UnsupportedQrToastAnimationState =
  | 'entering'
  | 'visible'
  | 'exiting';

export type UnsupportedQrToastState = {
  animationState: UnsupportedQrToastAnimationState;
  message: string;
};
