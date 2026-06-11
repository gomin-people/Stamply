"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDashboardQueryKeys } from "@/constants/adminDashboardQueryKeys";
import {
  ApiError,
  createJsonRequest,
  requestJson,
} from "@/features/shared/api/http";
import { extractRewardQrEventUserId } from "@/utils/qr";

type ClaimAdminRewardQrVariables = {
  eventId: number;
  qrValue: string;
};

type ClaimAdminRewardQrResponse = {
  success: boolean;
};

const getRewardQrScanErrorMessage = (error: "invalidQr" | "eventMismatch") =>
  error === "eventMismatch"
    ? "다른 행사의 리워드 QR입니다."
    : "인식할 수 없는 리워드 QR입니다.";

const claimAdminRewardQr = ({
  eventId,
  qrValue,
}: ClaimAdminRewardQrVariables) => {
  const extracted = extractRewardQrEventUserId(qrValue, eventId);

  if ("error" in extracted) {
    throw new ApiError(
      getRewardQrScanErrorMessage(extracted.error),
      400,
      extracted
    );
  }

  return requestJson<ClaimAdminRewardQrResponse>(
    `/api/v1/qr/reward/${encodeURIComponent(extracted.eventUserId)}`,
    createJsonRequest("POST", { eventId })
  );
};

/**
 * 어드민 리워드 QR 수령 처리 mutation입니다.
 *
 * @returns React Query 리워드 QR 수령 처리 mutation
 */
export function useClaimAdminRewardQrMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimAdminRewardQr,
    onSuccess: async (_, { eventId }) => {
      await queryClient.invalidateQueries({
        queryKey: adminDashboardQueryKeys.kpis(eventId),
      });
    },
  });
}
