"use client";

import { useMutation } from "@tanstack/react-query";
import { createJsonRequest, requestJson } from "@/features/shared/api/http";

type LoginPayload = {
  email: string;
  password: string;
};

export function useAdminLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      requestJson("/api/v1/admin/login", createJsonRequest("POST", payload)),
  });
}
