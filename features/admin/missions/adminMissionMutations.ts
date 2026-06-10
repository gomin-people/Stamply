"use client";

import { useMutation } from "@tanstack/react-query";
import { createJsonRequest, requestJson } from "@/features/shared/api/http";
import {
  type MissionModel,
  type MissionCreatePayloadModel,
  type MissionUpdatePayloadModel,
  type QrCodeModel,
} from "@/types/models";

// 미션 생성 응답 타입
type CreatedAdminMission = MissionModel & {
  qrCode: QrCodeModel;
};

// 미션 생성 mutation 요청 변수 타입
type CreateMissionVariables = {
  eventId: number;
  payload: MissionCreatePayloadModel;
};

// 미션 수정 mutation 요청 변수 타입
type UpdateMissionVariables = {
  eventId: number;
  missionId: number;
  payload: MissionUpdatePayloadModel;
};

// 미션 삭제 mutation 요청 변수 타입
type DeleteMissionVariables = {
  eventId: number;
  missionId: number;
};

// 미션 순서 변경 mutation 요청 변수 타입
type ReorderMissionsVariables = {
  eventId: number;
  missionIds: number[];
};

/**
 * 특정 행사에 미션을 생성합니다.
 *
 * @param eventId - 행사 ID
 * @param payload - 미션 생성 요청 데이터
 * @returns 생성된 미션과 QR 코드
 */
function createAdminEventMission(
  eventId: number,
  payload: MissionCreatePayloadModel
) {
  return requestJson<CreatedAdminMission>(
    `/api/v1/admin/events/${eventId}/missions`,
    createJsonRequest("POST", payload)
  );
}

/**
 * 특정 행사의 단일 미션을 부분 수정합니다.
 *
 * @param eventId - 행사 ID
 * @param missionId - 미션 ID
 * @param payload - 수정할 미션 필드
 * @returns 수정된 미션
 */
function updateAdminEventMission(
  eventId: number,
  missionId: number,
  payload: MissionUpdatePayloadModel
) {
  return requestJson<MissionModel>(
    `/api/v1/admin/events/${eventId}/missions/${missionId}`,
    createJsonRequest("PATCH", payload)
  );
}

/**
 * 특정 행사의 단일 미션을 삭제합니다.
 *
 * @param eventId - 행사 ID
 * @param missionId - 미션 ID
 * @returns 삭제된 미션 ID
 */
function deleteAdminEventMission(eventId: number, missionId: number) {
  return requestJson<{ id: number }>(
    `/api/v1/admin/events/${eventId}/missions/${missionId}`,
    createJsonRequest("DELETE")
  );
}

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

/**
 * 어드민 미션 순서 변경 mutation입니다.
 * missionIds 배열의 순서가 새로운 sort_order가 됩니다.
 *
 * @returns React Query 미션 순서 변경 mutation
 */
export function useReorderAdminMissionsMutation() {
  return useMutation({
    mutationFn: ({ eventId, missionIds }: ReorderMissionsVariables) =>
      requestJson<{ missionIds: number[] }>(
        `/api/v1/admin/events/${eventId}/missions/reorder`,
        createJsonRequest("PUT", { missionIds })
      ),
  });
}
