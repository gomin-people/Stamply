export function getMissionCheckUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return `${baseUrl}/api/v1/qr/mission-check/${token}`;
}
