// 관리자 이벤트 경로 ID 추출
export const getAdminEventIdFromPathname = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const eventIdIndex = segments.indexOf('events') + 1;

  return eventIdIndex > 0 ? segments[eventIdIndex] : null;
};
