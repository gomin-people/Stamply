type UserUnavailablePageProps = {
  searchParams?: Promise<{
    reason?: string | string[];
  }>;
};

const USER_UNAVAILABLE_MESSAGES = {
  missionInactive: "비활성화된 미션입니다.",
  missionNotFound: "존재하지 않는 미션입니다.",
  eventNotStarted: "아직 시작되지 않은 행사입니다.",
  eventEnded: "이미 종료된 행사입니다.",
} as const;

const getUserUnavailableMessage = (reason?: string | string[]) => {
  const normalizedReason = Array.isArray(reason) ? reason[0] : reason;

  if (normalizedReason === "not-found") {
    return USER_UNAVAILABLE_MESSAGES.missionNotFound;
  }

  if (normalizedReason === "event-not-started") {
    return USER_UNAVAILABLE_MESSAGES.eventNotStarted;
  }

  if (normalizedReason === "event-ended") {
    return USER_UNAVAILABLE_MESSAGES.eventEnded;
  }

  return USER_UNAVAILABLE_MESSAGES.missionInactive;
};

const UserUnavailablePage = async ({
  searchParams,
}: UserUnavailablePageProps) => {
  const params = await searchParams;
  const message = getUserUnavailableMessage(params?.reason);

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-100.5 flex flex-col items-center justify-center px-12 -translate-y-25">
        <p className="font-sans text-base font-bold leading-normal text-center">
          {message}
        </p>
      </div>
    </main>
  );
};

export default UserUnavailablePage;
