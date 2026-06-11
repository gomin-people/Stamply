"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJsonRequest, requestJson } from "@/features/shared/api/http";
import { type ParticipantModel, type SurveyPayloadModel } from "@/types/models";
import { type ParticipantMissions } from "@/features/participant/missions/participantMissionQueries";

function submitParticipantSurvey(payload: SurveyPayloadModel) {
  return requestJson<ParticipantModel>(
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
    onSuccess: (data) => {
      queryClient.setQueryData<ParticipantMissions>(
        ["participant", "missions"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            participant: {
              ...oldData.participant,
              gender: data.gender,
              ageRange: data.ageRange,
            },
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["participant"] });
    },
  });
}
