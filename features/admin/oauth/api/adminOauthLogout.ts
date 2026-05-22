import { createJsonRequest, requestJson } from '@/features/shared/api/http';

/**
 * 어드민 로그아웃을 수행합니다.
 *
 * @returns 로그아웃 결과 메시지
 */
export function logoutAdmin() {
    return requestJson<{ message: string }>(
        '/api/v1/admin/oauth/logout',
        createJsonRequest('POST')
    );
}
