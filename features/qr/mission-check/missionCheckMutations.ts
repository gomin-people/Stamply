'use client';

import { useMutation } from '@tanstack/react-query';
import { completeMissionByToken } from '@/features/qr/mission-check/api/missionCheckApi';

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
