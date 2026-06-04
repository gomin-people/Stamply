"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJsonRequest, requestJson } from "@/features/shared/api/http";
import {
  type Participant,
  type SurveyPayload,
} from "@/features/shared/types/stamply";

function submitParticipantSurvey(payload: SurveyPayload) {
  return requestJson<Participant>(
    "/api/v1/participant/survey",
    createJsonRequest("POST", payload)
  );
}

/**
 * 참여자 설문 저장 mutation입니다.
 *
 * @returns React Query 설문 저장 mutation
 */
export function useSubmitSurveyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitParticipantSurvey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participant"] });
    },
  });
}
