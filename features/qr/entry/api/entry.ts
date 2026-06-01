import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PARTICIPANT_COOKIE_NAME } from "@/utils/api";
import { type StamplyEvent } from "@/features/shared/types/stamply";
import { type ApiDataResponse } from "@/features/shared/api/http";
import { getRequestOrigin } from "@/utils/server-url";

export const getEntryEvent = async (eventId: string): Promise<StamplyEvent> => {
  const cookieStore = await cookies();
  const participantCookie = cookieStore.get(PARTICIPANT_COOKIE_NAME);

  if (!participantCookie) {
    redirect("/qr-required");
  }

  const baseUrl = await getRequestOrigin();
  const res = await fetch(`${baseUrl}/api/v1/participant/events/${eventId}`, {
    headers: {
      Cookie: `${PARTICIPANT_COOKIE_NAME}=${participantCookie.value}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/qr-required");
  }

  const { data: event } = (await res.json()) as ApiDataResponse<StamplyEvent>;
  return event;
};
