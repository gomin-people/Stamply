import { useMutation } from "@tanstack/react-query";

export function useAdminLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/admin/logout", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    },
  });
}
