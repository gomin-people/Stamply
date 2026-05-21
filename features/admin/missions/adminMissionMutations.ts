'use client';

import { useMutation } from '@tanstack/react-query';
import {
  createAdminEventMission,
  deleteAdminEventMission,
  updateAdminEventMission,
} from '@/features/admin/missions/api/adminMissionsApi';
import {
  type MissionCreatePayload,
  type MissionUpdatePayload,
} from '@/features/shared/types/stamply';

// 미션 생성 mutation 요청 변수 타입
type CreateMissionVariables = {
  eventId: number;
  payload: MissionCreatePayload;
};

// 미션 수정 mutation 요청 변수 타입
type UpdateMissionVariables = {
  eventId: number;
  missionId: number;
  payload: MissionUpdatePayload;
};

// 미션 삭제 mutation 요청 변수 타입
type DeleteMissionVariables = {
  eventId: number;
  missionId: number;
};

/**
 * 어드민 미션 생성 mutation입니다.
 *
 * @returns React Query 미션 생성 mutation
 */
export function useCreateAdminMissionMutation() {
  return useMutation({
    mutationFn: ({ eventId, payload }: CreateMissionVariables) =>
      createAdminEventMission(eventId, payload),
  });
}

/**
 * 어드민 미션 수정 mutation입니다.
 *
 * @returns React Query 미션 수정 mutation
 */
export function useUpdateAdminMissionMutation() {
  return useMutation({
    mutationFn: ({ eventId, missionId, payload }: UpdateMissionVariables) =>
      updateAdminEventMission(eventId, missionId, payload),
  });
}

/**
 * 어드민 미션 삭제 mutation입니다.
 *
 * @returns React Query 미션 삭제 mutation
 */
export function useDeleteAdminMissionMutation() {
  return useMutation({
    mutationFn: ({ eventId, missionId }: DeleteMissionVariables) =>
      deleteAdminEventMission(eventId, missionId),
  });
}
