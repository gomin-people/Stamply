import 'server-only';
import { headers } from 'next/headers';

/**
 * 현재 서버 요청의 origin을 반환합니다.
 *
 * @returns 현재 요청 host 기준 origin, 요청 헤더가 없으면 NEXT_PUBLIC_BASE_URL fallback
 */
export async function getRequestOrigin() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');

  if (!host) {
    return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  }

  const protocol =
    headersList.get('x-forwarded-proto') ??
    (host.startsWith('localhost') ? 'http' : 'https');

  return `${protocol}://${host}`;
}
