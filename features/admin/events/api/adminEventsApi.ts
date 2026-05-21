import { createJsonRequest, requestJson } from '@/features/shared/api/http';
import {
  type EventCreatePayload,
  type EventUpdatePayload,
  type Mission,
  type QrCode,
  type StamplyEvent,
} from '@/features/shared/types/stamply';

// 어드민 행사 상세 응답 타입
export type AdminEventDetail = StamplyEvent & {
  missions: Mission[];
  qrCodes: QrCode[];
  participantCount: number;
};

// 행사 생성 응답 타입
export type CreatedEvent = StamplyEvent & {
  qrCodes: QrCode[];
};

// 행사 대시보드 응답 타입
export type EventDashboard = {
  event: StamplyEvent;
  summary: {
    missionCount: number;
    activeMissionCount: number;
    participantCount: number;
    completionCount: number;
    rewardClaimedCount: number;
    completionRate: number;
  };
  missions: Array<
    Pick<Mission, 'id' | 'title' | 'sortOrder' | 'isActive'> & {
      completedCount: number;
    }
  >;
};

/**
 * 어드민 행사 목록을 조회합니다.
 *
 * @param userId - 선택적으로 필터링할 운영자 ID
 * @returns 어드민 행사 목록
 */
export function getAdminEvents(userId?: number) {
  const searchParams = new URLSearchParams();

  if (userId !== undefined) {
    searchParams.set('userId', String(userId));
  }

  const queryString = searchParams.toString();
  const path =
    queryString.length > 0
      ? `/api/v1/admin/events?${queryString}`
      : '/api/v1/admin/events';

  return requestJson<StamplyEvent[]>(path);
}

/**
 * 어드민 행사 상세를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns 행사 상세, 미션, QR, 참여자 수
 */
export function getAdminEvent(eventId: number) {
  return requestJson<AdminEventDetail>(`/api/v1/admin/events/${eventId}`);
}

/**
 * 어드민 행사를 생성합니다.
 *
 * @param payload - 행사 생성 요청 값
 * @returns 생성된 행사와 입장 QR 코드
 */
export function createAdminEvent(payload: EventCreatePayload) {
  return requestJson<CreatedEvent>(
    '/api/v1/admin/events',
    createJsonRequest('POST', payload)
  );
}

/**
 * 어드민 행사를 수정합니다.
 *
 * @param eventId - 행사 ID
 * @param payload - 수정할 행사 필드
 * @returns 수정된 행사
 */
export function updateAdminEvent(
  eventId: number,
  payload: EventUpdatePayload
) {
  return requestJson<StamplyEvent>(
    `/api/v1/admin/events/${eventId}`,
    createJsonRequest('PATCH', payload)
  );
}

/**
 * 어드민 행사를 삭제합니다.
 *
 * @param eventId - 행사 ID
 * @returns 삭제된 행사 ID
 */
export function deleteAdminEvent(eventId: number) {
  return requestJson<{ id: number }>(
    `/api/v1/admin/events/${eventId}`,
    createJsonRequest('DELETE')
  );
}

/**
 * 행사 대시보드 데이터를 조회합니다.
 *
 * @param eventId - 행사 ID
 * @returns 행사 대시보드 집계 데이터
 */
export function getEventDashboard(eventId: number) {
  return requestJson<EventDashboard>(
    `/api/v1/admin/events/${eventId}/dashboard`
  );
}
