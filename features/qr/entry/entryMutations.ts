'use client';

import { useMutation } from '@tanstack/react-query';
import { enterEventByToken } from '@/features/qr/entry/api/entryApi';

// 행사 입장 mutation 요청 변수 타입
type EnterEventVariables = {
  token: string;
  userId?: number;
};

/**
 * ENTRY QR 기반 행사 입장 mutation입니다.
 *
 * @returns React Query 행사 입장 mutation
 */
export function useEnterEventMutation() {
  return useMutation({
    mutationFn: ({ token, userId }: EnterEventVariables) =>
      enterEventByToken(token, userId),
  });
}
