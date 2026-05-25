'use client';

import { useMutation } from '@tanstack/react-query';
export function useLogoutAdminMutation() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/v1/admin/oauth/logout', {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    },
  });
}
