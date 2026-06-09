"use client";

import { useMutation } from "@tanstack/react-query";
import { createJsonRequest, requestJson } from "@/features/shared/api/http";

export type RewardQrData = {
  eventUserId: string;
  eventsId: number;
};

const createRewardQr = () =>
  requestJson<RewardQrData>(
    "/api/v1/participant/reward-qr",
    createJsonRequest("POST")
  );

/**
 * REWARD QR 발급 mutation입니다.
 *
 * @returns React Query REWARD QR 발급 mutation
 */
export const useCreateRewardQrMutation = () =>
  useMutation<RewardQrData, Error, void>({
    mutationFn: createRewardQr,
  });
