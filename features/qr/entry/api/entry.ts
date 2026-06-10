import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PARTICIPANT_COOKIE_NAME, parsePositiveInteger } from "@/utils/api";
import { type EventModel, type Gender } from "@/types/models";
import { supabase } from "@/utils/supabase/server";
import { toCamelKeys } from "@/utils/case";

export type ParticipantUser = {
  id: number;
  events_id: number;
  user_id: string | null;
  event_user_id: string;
  gender: Gender | null;
  age_range: string | null;
  is_reward_claimed: boolean;
  created_at: string;
};

export const getEntryEventAndParticipant = async (
  eventIdParam: string
): Promise<{ event: EventModel; participant: ParticipantUser }> => {
  const cookieStore = await cookies();
  const participantCookie = cookieStore.get(PARTICIPANT_COOKIE_NAME);

  if (!participantCookie) {
    redirect("/qr-required");
  }

  const eventId = parsePositiveInteger(eventIdParam);
  if (eventId === null) {
    redirect("/qr-required");
  }

  // 1. 참여자 정보 및 이벤트 정보 단일 쿼리 조인 조회
  const { data: participant, error: participantError } = await supabase
    .from("participant_users")
    .select("*, events (*)")
    .eq("event_user_id", participantCookie.value)
    .maybeSingle();

  if (participantError || !participant) {
    redirect("/qr-required");
  }

  if (participant.events_id !== eventId) {
    redirect("/qr-required");
  }

  const event = participant.events;
  if (!event) {
    redirect("/qr-required");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { events, ...participantData } = participant;

  return {
    event: toCamelKeys(event) as unknown as EventModel,
    participant: participantData,
  };
};

export const getEntryEvent = async (
  eventIdParam: string
): Promise<EventModel> => {
  const { event } = await getEntryEventAndParticipant(eventIdParam);
  return event;
};
