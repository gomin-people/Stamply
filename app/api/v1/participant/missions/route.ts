import { type NextRequest } from 'next/server';
import { getCurrentParticipant, ok, serverError } from '@/utils/api';
import { supabase } from '@/utils/supabase/server';

/**
 * 현재 참여자의 활성 미션 목록과 완료 상태를 조회합니다.
 *
 * @param request - 참여자 식별 쿠키를 포함한 요청 객체
 * @returns 미션별 완료 상태와 진행 요약
 */
export async function GET(request: NextRequest) {
  const result = await getCurrentParticipant(request);

  if ('response' in result) {
    return result.response;
  }

  const [
    { data: missions, error: missionsError },
    { data: completions, error: completionsError },
  ] = await Promise.all([
    // missions 테이블에서 현재 참여자의 events_id와 is_active 기준 미션 목록 조회
    supabase
      .from('missions')
      .select('*')
      .eq('events_id', result.participant.events_id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true }),
    // mission_completions 테이블에서 events_id와 participant_users_id 기준 완료 기록 조회
    supabase
      .from('mission_completions')
      .select('missions_id,completed_at')
      .eq('events_id', result.participant.events_id)
      .eq('participant_users_id', result.participant.id),
  ]);

  if (missionsError) {
    return serverError('참여자 미션 조회 실패', missionsError);
  }

  if (completionsError) {
    return serverError('참여자 완료 미션 조회 실패', completionsError);
  }

  const completionMap = new Map<number, string>();

  // 완료 기록을 미션 ID 기준 Map으로 바꿔 미션 목록에 빠르게 병합
  for (const completion of completions ?? []) {
    if (
      typeof completion.missions_id === 'number' &&
      typeof completion.completed_at === 'string'
    ) {
      completionMap.set(completion.missions_id, completion.completed_at);
    }
  }

  const missionProgress =
    missions?.map((mission) => ({
      ...mission,
      is_completed: completionMap.has(mission.id),
      completed_at: completionMap.get(mission.id) ?? null,
    })) ?? [];

  return ok({
    participant: result.participant,
    missions: missionProgress,
    summary: {
      total_count: missionProgress.length,
      completed_count: missionProgress.filter((mission) => mission.is_completed)
        .length,
    },
  });
}
