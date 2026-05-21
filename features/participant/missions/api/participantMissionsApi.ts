import { requestJson } from '@/features/shared/api/http';
import {
  type Mission,
  type Participant,
} from '@/features/shared/types/stamply';

// 참여자 미션 진행 상태 타입
export type ParticipantMission = Mission & {
  isCompleted: boolean;
  completedAt: string | null;
};

// 참여자 미션 진행률 응답 타입
export type ParticipantMissions = {
  participant: Participant;
  missions: ParticipantMission[];
  summary: {
    totalCount: number;
    completedCount: number;
  };
};

/**
 * 쿠키 기준 현재 참여자의 미션 진행 상태를 조회합니다.
 *
 * @returns 미션별 완료 상태와 진행 요약
 */
export function getParticipantMissions() {
  return requestJson<ParticipantMissions>('/api/v1/participant/missions');
}
