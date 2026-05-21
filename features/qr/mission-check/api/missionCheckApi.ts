import { createJsonRequest, requestJson } from '@/features/shared/api/http';
import {
  type Mission,
  type MissionCompletion,
} from '@/features/shared/types/stamply';

// 미션 완료 응답 타입
export type CompletedMission = {
  mission: Mission;
  completion: MissionCompletion;
};

/**
 * QR 토큰으로 미션 완료를 요청합니다.
 *
 * @param token - MISSION QR token
 * @returns 완료된 미션과 완료 기록
 */
export function completeMissionByToken(token: string) {
  return requestJson<CompletedMission>(
    `/api/v1/qr/mission-check/${token}`,
    createJsonRequest('POST')
  );
}
