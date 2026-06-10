"use client";

import { useMutation } from "@tanstack/react-query";
import { requestJson } from "@/features/shared/api/http";
import {
  type ParticipantModel,
  type QrCodeModel,
  type EventModel,
} from "@/types/models";

// 입장 QR 처리 응답 타입
type EntryResult = {
  event: EventModel;
  participant: ParticipantModel;
  qrCode: QrCodeModel;
};

// 행사 입장 mutation 요청 변수 타입
type EnterEventVariables = {
  token: string;
  userId?: string;
};

function enterEventByToken(token: string, userId?: string) {
  const searchParams = new URLSearchParams();

  if (userId !== undefined) {
    searchParams.set("userId", String(userId));
  }

  const queryString = searchParams.toString();
  const path =
    queryString.length > 0
      ? `/api/v1/qr/entry/${token}?${queryString}`
      : `/api/v1/qr/entry/${token}`;

  return requestJson<EntryResult>(path);
}

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
