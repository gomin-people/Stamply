"use client";

import { useQuery } from "@tanstack/react-query";
import { requestJson } from "@/features/shared/api/http";
import { type MissionModel, type ParticipantModel } from "@/types/models";

export type ParticipantMission = MissionModel & {
  isCompleted: boolean;
  completedAt: string | null;
  token?: string | null;
};

// 참여자 미션 진행률 응답 타입
export type ParticipantMissions = {
  participant: ParticipantModel;
  missions: ParticipantMission[];
  summary: {
    totalCount: number;
    completedCount: number;
  };
};

function getParticipantMissions() {
  return requestJson<ParticipantMissions>("/api/v1/participant/missions");
}

/**
 * 현재 참여자의 미션 진행 상태를 조회합니다.
 *
 * [참고] 어드민 행사 등록 Step 3의 모바일 미리보기 등 유저 참여 세션이 없는 환경에서는,
 * React Hook 호출 규칙에 의해 이 쿼리가 무조건 자동 실행되어 API 오류(401)를 유발하고
 * 화면 전체를 에러 덮어쓰기 UI로 가려버립니다. 이를 우회하고 불필요한 요청을 차단할 수 있도록
 * 쿼리 제어 옵션(예: enabled: !isPreview)을 동적으로 주입받아 전파할 수 있게 설계되었습니다.
 *
 * @param options - React Query의 enabled 비활성화, initialData 주입 등 제어 옵션
 * @returns React Query 참여자 미션 진행
 */
export function useParticipantMissionsQuery(options?: {
  enabled?: boolean;
  initialData?: ParticipantMissions;
}) {
  return useQuery({
    queryKey: ["participant", "missions"],
    queryFn: getParticipantMissions,
    // 서버에서 prefetch한 데이터가 있으면 30초간 fresh로 유지해 클라이언트 첫 fetch와
    // 포커스 재진입 시 자동 refetch를 억제한다.
    staleTime: 30_000,
    ...options,
  });
}
