import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PARTICIPANT_COOKIE_NAME } from "@/utils/api";
import { supabase } from "@/utils/supabase/server";

export type ParticipantMissionServerData = {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
};

/**
 * 서버 사이드에서 참여자의 미션 목록과 완료 현황을 직접 DB에서 조회합니다.
 * 쿠키 세션을 사용하므로 서버 전용(Server-only) 환경에서 동작합니다.
 */
export const getParticipantMissionsServer = async (prefetchedParticipant?: {
  id: number;
  events_id: number;
}): Promise<ParticipantMissionServerData[]> => {
  let participant: { id: number; events_id: number };

  if (prefetchedParticipant) {
    participant = prefetchedParticipant;
  } else {
    const cookieStore = await cookies();
    const participantCookie = cookieStore.get(PARTICIPANT_COOKIE_NAME);

    if (!participantCookie) {
      redirect("/qr-required");
    }

    // 1. 참여자 정보 조회
    const { data: dbParticipant, error: participantError } = await supabase
      .from("participant_users")
      .select("*")
      .eq("event_user_id", participantCookie.value)
      .maybeSingle();

    if (participantError || !dbParticipant) {
      redirect("/qr-required");
    }
    participant = dbParticipant;
  }

  // 2. 미션 정보 및 완료 상태 병합 조회
  const [
    { data: missions, error: missionsError },
    { data: completions, error: completionsError },
  ] = await Promise.all([
    supabase
      .from("missions")
      .select("*")
      .eq("events_id", participant.events_id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true }),
    supabase
      .from("mission_completions")
      .select("missions_id,completed_at")
      .eq("events_id", participant.events_id)
      .eq("participant_users_id", participant.id),
  ]);

  if (missionsError || completionsError) {
    throw new Error("참여자 미션 데이터 조회 실패");
  }

  const completionMap = new Map<number, string>();
  const activeMissionIds = new Set(missions?.map((m) => m.id) ?? []);

  for (const completion of completions ?? []) {
    if (
      typeof completion.missions_id === "number" &&
      typeof completion.completed_at === "string" &&
      activeMissionIds.has(completion.missions_id)
    ) {
      completionMap.set(completion.missions_id, completion.completed_at);
    }
  }

  const missionProgress: ParticipantMissionServerData[] =
    missions?.map((mission) => ({
      id: mission.id,
      title: mission.title,
      description: mission.description,
      isCompleted: completionMap.has(mission.id),
    })) ?? [];

  return missionProgress;
};
