"use client";

import { useQuery } from "@tanstack/react-query";
import { requestJson } from "@/features/shared/api/http";
import { type Participant } from "@/features/shared/types/stamply";

// 현재 참여자 조회 응답 타입
type ParticipantState = {
  participant: Participant;
};

function getParticipant() {
  return requestJson<ParticipantState>("/api/v1/participant");
}

/**
 * 현재 참여자 상태를 조회합니다.
 *
 * @returns React Query 참여자 상태
 */
export function useParticipantQuery() {
  return useQuery({
    queryKey: ["participant", "state"],
    queryFn: getParticipant,
  });
}
