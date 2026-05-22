import { useQuery } from '@tanstack/react-query';
import { getAdminUser } from '@/features/admin/oauth/user/api/adminOauthUser';

export function useAdminOauthUserQueries() {
    return useQuery({
        queryKey: ['adminUser'],
        queryFn: getAdminUser,
    });

}