'use client';

import { useMutation } from '@tanstack/react-query';
import { createJsonRequest, requestJson } from '@/features/shared/api/http';
import {
  type EventCreatePayload,
  type EventUpdatePayload,
  type QrCode,
  type StamplyEvent,
} from '@/features/shared/types/stamply';

// 행사 생성 응답 타입
type CreatedEvent = StamplyEvent & {
  qrCodes: QrCode[];
};

// 행사 수정 mutation 요청 변수 타입
type UpdateEventVariables = {
  eventId: number;
  payload: EventUpdatePayload;
};

function createAdminEvent(payload: EventCreatePayload) {
  return requestJson<CreatedEvent>(
    '/api/v1/admin/events',
    createJsonRequest('POST', payload)
  );
}

function updateAdminEvent(
  eventId: number,
  payload: EventUpdatePayload
) {
  return requestJson<StamplyEvent>(
    `/api/v1/admin/events/${eventId}`,
    createJsonRequest('PATCH', payload)
  );
}

function deleteAdminEvent(eventId: number) {
  return requestJson<{ id: number }>(
    `/api/v1/admin/events/${eventId}`,
    createJsonRequest('DELETE')
  );
}

/**
 * 어드민 행사 생성 mutation입니다.
 *
 * @returns React Query 행사 생성 mutation
 */
export function useCreateEventMutation() {
  return useMutation({
    mutationFn: createAdminEvent,
  });
}

/**
 * 어드민 행사 수정 mutation입니다.
 *
 * @returns React Query 행사 수정 mutation
 */
export function useUpdateEventMutation() {
  return useMutation({
    mutationFn: ({ eventId, payload }: UpdateEventVariables) =>
      updateAdminEvent(eventId, payload),
  });
}

/**
 * 어드민 행사 삭제 mutation입니다.
 *
 * @returns React Query 행사 삭제 mutation
 */
export function useDeleteEventMutation() {
  return useMutation({
    mutationFn: deleteAdminEvent,
  });
}
