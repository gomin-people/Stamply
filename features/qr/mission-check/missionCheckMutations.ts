"use client";

import { useMutation } from "@tanstack/react-query";
import { createJsonRequest, requestJson } from "@/features/shared/api/http";
import { type MissionModel, type MissionCompletionModel } from "@/types/models";

// 미션 완료 응답 타입
type CompletedMission = {
  mission: MissionModel;
  completion: MissionCompletionModel;
};

function completeMissionByToken(token: string) {
  return requestJson<CompletedMission>(
    `/api/v1/qr/mission-check/${token}`,
    createJsonRequest("POST")
  );
}

/**
 * 사용자 미션 완료 mutation입니다.
 *
 * @returns React Query 미션 완료 mutation
 */
export function useCompleteMissionMutation() {
  return useMutation({
    mutationFn: completeMissionByToken,
  });
}
