export const getUserUnavailablePath = (message: string | null) =>
  message === "존재하지 않는 미션입니다."
    ? "/user-unavailable?reason=not-found"
    : "/user-unavailable";
