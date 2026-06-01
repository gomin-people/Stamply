type MissionUnavailablePageProps = {
  searchParams?: Promise<{
    reason?: string | string[];
  }>;
};

const MISSION_UNAVAILABLE_MESSAGES = {
  inactive: "비활성화된 미션입니다.",
  notFound: "존재하지 않는 미션입니다.",
} as const;

const getMissionUnavailableMessage = (reason?: string | string[]) => {
  const normalizedReason = Array.isArray(reason) ? reason[0] : reason;

  if (normalizedReason === "not-found") {
    return MISSION_UNAVAILABLE_MESSAGES.notFound;
  }

  return MISSION_UNAVAILABLE_MESSAGES.inactive;
};

const MissionUnavailablePage = async ({
  searchParams,
}: MissionUnavailablePageProps) => {
  const params = await searchParams;
  const message = getMissionUnavailableMessage(params?.reason);

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

export default MissionUnavailablePage;
