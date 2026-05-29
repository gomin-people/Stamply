import "server-only";
import { headers } from "next/headers";

/**
 * 현재 서버 요청의 origin을 반환합니다.
 *
 * @returns 현재 요청 host 기준 origin, 요청 헤더가 없으면 로컬 origin
 */
export const getRequestOrigin = async () => {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

  if (!host) {
    return "http://localhost:3000";
  }

  const protocol =
    headersList.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
};
