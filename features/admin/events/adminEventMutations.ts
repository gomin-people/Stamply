'use client';

import { useMutation } from '@tanstack/react-query';
import {
  createAdminEvent,
  deleteAdminEvent,
  updateAdminEvent,
} from '@/features/admin/events/api/adminEventsApi';
import { type EventUpdatePayload } from '@/features/shared/types/stamply';

// 행사 수정 mutation 요청 변수 타입
type UpdateEventVariables = {
  eventId: number;
  payload: EventUpdatePayload;
};

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
