import { useQuery } from '@tanstack/react-query';

export function useAdminOauthUserQueries() {
  return useQuery({
    queryKey: ['adminUser'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin/oauth/user');
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    },
  });
}
