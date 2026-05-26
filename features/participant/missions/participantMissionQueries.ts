'use client';

import { useQuery } from '@tanstack/react-query';
import { requestJson } from '@/features/shared/api/http';
import {
  type Mission,
  type Participant,
} from '@/features/shared/types/stamply';

// 참여자 미션 진행 상태 타입
type ParticipantMission = Mission & {
  isCompleted: boolean;
  completedAt: string | null;
};

// 참여자 미션 진행률 응답 타입
type ParticipantMissions = {
  participant: Participant;
  missions: ParticipantMission[];
  summary: {
    totalCount: number;
    completedCount: number;
  };
};

function getParticipantMissions() {
  return requestJson<ParticipantMissions>('/api/v1/participant/missions');
}

/**
 * 현재 참여자의 미션 진행 상태를 조회합니다.
 *
 * @returns React Query 참여자 미션 진행
 */
export function useParticipantMissionsQuery() {
  return useQuery({
    queryKey: ['participant', 'missions'],
    queryFn: getParticipantMissions,
  });
}
