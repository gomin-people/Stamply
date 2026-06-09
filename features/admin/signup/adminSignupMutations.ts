"use client";

import { useMutation } from "@tanstack/react-query";
import { createJsonRequest, requestJson } from "@/features/shared/api/http";

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

export function useAdminSignupMutation() {
  return useMutation({
    mutationFn: (payload: SignUpPayload) =>
      requestJson("/api/v1/admin/signup", createJsonRequest("POST", payload)),
  });
}
