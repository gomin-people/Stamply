"use client";

import { useQuery } from "@tanstack/react-query";
import { requestJson } from "@/features/shared/api/http";
import { type Participant } from "@/features/shared/types/stamply";

// 참여자 설문 상태 응답 타입
type ParticipantSurvey = Pick<
  Participant,
  "gender" | "ageRange" | "isRewardClaimed"
>;

function getParticipantSurvey() {
  return requestJson<ParticipantSurvey>("/api/v1/participant/survey");
}

/**
 * 현재 참여자의 설문 상태를 조회합니다.
 *
 * @returns React Query 참여자 설문
 */
export function useParticipantSurveyQuery() {
  return useQuery({
    queryKey: ["participant", "survey"],
    queryFn: getParticipantSurvey,
  });
}
