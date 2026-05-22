import { requestJson } from '@/features/shared/api/http';
import { AdminUserModel } from '@/types/models/admin';

/**
 * 현재 로그인한 어드민 유저 정보를 조회합니다.
 *
 * @returns 어드민 유저 정보
 */
export function getAdminUser() {
  return requestJson<AdminUserModel>('/api/v1/admin/oauth/user');
}
