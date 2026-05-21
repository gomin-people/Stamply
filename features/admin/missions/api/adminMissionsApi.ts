import { createJsonRequest, requestJson } from '@/features/shared/api/http';
import {
  type Mission,
  type MissionCreatePayload,
  type MissionUpdatePayload,
  type QrCode,
} from '@/features/shared/types/stamply';

// 미션 생성 응답 타입
export type CreatedAdminMission = Mission & {
  qrCode: QrCode;
};

// 미션 상세 응답 타입
export type AdminMissionDetail = Mission & {
  qrCode: QrCode | null;
};

/**
 * 어드민 미션 목록을 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns 행사 하위 미션 목록
 */
export function getAdminEventMissions(eventId: number) {
  return requestJson<Mission[]>(`/api/v1/admin/events/${eventId}/missions`);
}

/**
 * 어드민 미션 상세를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @param missionId - 미션 ID
 * @returns 미션 상세와 연결된 QR
 */
export function getAdminEventMission(eventId: number, missionId: number) {
  return requestJson<AdminMissionDetail>(
    `/api/v1/admin/events/${eventId}/missions/${missionId}`
  );
}

/**
 * 행사 하위 미션을 생성합니다.
 *
 * @param eventId - 행사 ID
 * @param payload - 미션 생성 요청 값
 * @returns 생성된 미션과 QR
 */
export function createAdminEventMission(
  eventId: number,
  payload: MissionCreatePayload
) {
  return requestJson<CreatedAdminMission>(
    `/api/v1/admin/events/${eventId}/missions`,
    createJsonRequest('POST', payload)
  );
}

/**
 * 행사 하위 미션을 수정합니다.
 *
 * @param eventId - 행사 ID
 * @param missionId - 미션 ID
 * @param payload - 수정할 미션 필드
 * @returns 수정된 미션
 */
export function updateAdminEventMission(
  eventId: number,
  missionId: number,
  payload: MissionUpdatePayload
) {
  return requestJson<Mission>(
    `/api/v1/admin/events/${eventId}/missions/${missionId}`,
    createJsonRequest('PATCH', payload)
  );
}

/**
 * 행사 하위 미션을 삭제합니다.
 *
 * @param eventId - 행사 ID
 * @param missionId - 미션 ID
 * @returns 삭제된 미션 ID
 */
export function deleteAdminEventMission(eventId: number, missionId: number) {
  return requestJson<{ id: number }>(
    `/api/v1/admin/events/${eventId}/missions/${missionId}`,
    createJsonRequest('DELETE')
  );
}
