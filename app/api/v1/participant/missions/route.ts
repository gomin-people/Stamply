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
    // TODO: [테스트용 코드 - 배포 전 삭제] (토큰 노출 취약점 예방) - START
    { data: qrCodes, error: qrCodesError },
    // TODO: [테스트용 코드 - 배포 전 삭제] - END
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
    // TODO: [테스트용 코드 - 배포 전 삭제] (토큰 노출 취약점 예방) - START
    // qr_codes 테이블에서 이 행사의 미션 완료 QR 토큰들 조회
    supabase
      .from('qr_codes')
      .select('missions_id,token')
      .eq('events_id', result.participant.events_id)
      .eq('type', 'MISSION'),
    // TODO: [테스트용 코드 - 배포 전 삭제] - END
  ]);

  if (missionsError) {
    return serverError('참여자 미션 조회 실패', missionsError);
  }

  if (completionsError) {
    return serverError('참여자 완료 미션 조회 실패', completionsError);
  }

  // TODO: [테스트용 코드 - 배포 전 삭제] - START
  if (qrCodesError) {
    return serverError('미션 QR 토큰 조회 실패', qrCodesError);
  }
  // TODO: [테스트용 코드 - 배포 전 삭제] - END

  const completionMap = new Map<number, string>();
  // TODO: [테스트용 코드 - 배포 전 삭제] (토큰 노출 취약점 예방) - START
  const qrMap = new Map<number, string>();
  // TODO: [테스트용 코드 - 배포 전 삭제] - END

  // 완료 기록을 미션 ID 기준 Map으로 바꿔 미션 목록에 빠르게 병합
  for (const completion of completions ?? []) {
    if (
      typeof completion.missions_id === 'number' &&
      typeof completion.completed_at === 'string'
    ) {
      completionMap.set(completion.missions_id, completion.completed_at);
    }
  }

  // TODO: [테스트용 코드 - 배포 전 삭제] (토큰 노출 취약점 예방) - START
  // QR 토큰 매핑 데이터 생성
  for (const qr of qrCodes ?? []) {
    if (typeof qr.missions_id === 'number' && typeof qr.token === 'string') {
      qrMap.set(qr.missions_id, qr.token);
    }
  }
  // TODO: [테스트용 코드 - 배포 전 삭제] - END

  const missionProgress =
    missions?.map((mission) => ({
      ...mission,
      is_completed: completionMap.has(mission.id),
      completed_at: completionMap.get(mission.id) ?? null,
      // TODO: [테스트용 코드 - 배포 전 삭제] (토큰 노출 취약점 예방) - START
      token: qrMap.get(mission.id) ?? null, // QR 토큰 포함
      // TODO: [테스트용 코드 - 배포 전 삭제] - END
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

// TODO: [테스트용 코드 - 배포 전 삭제] - START
/**
 * 테스트용: 현재 참여자의 특정 미션을 강제로 완료 처리합니다.
 */
export async function POST(request: NextRequest) {
  const result = await getCurrentParticipant(request);

  if ('response' in result) {
    return result.response;
  }

  const reqBody = await request.json().catch(() => ({}));
  const missionId = reqBody.missionId;

  if (typeof missionId !== 'number') {
    return badRequest('올바른 missionId가 필요합니다.');
  }

  // 1. 이미 완료되었는지 확인
  const { data: existing } = await supabase
    .from('mission_completions')
    .select('id')
    .eq('events_id', result.participant.events_id)
    .eq('participant_users_id', result.participant.id)
    .eq('missions_id', missionId)
    .maybeSingle();

  if (existing) {
    return ok({ message: '이미 완료 처리된 미션입니다.' });
  }

  // 2. 완료 레코드 삽입
  const { error } = await supabase
    .from('mission_completions')
    .insert({
      events_id: result.participant.events_id,
      participant_users_id: result.participant.id,
      missions_id: missionId,
      completed_at: new Date().toISOString(),
    });

  if (error) {
    return serverError('미션 강제 완료 실패', error);
  }

  return ok({ success: true, message: '미션 완료 처리 완료' });
}

/**
 * 테스트용: 현재 참여자의 특정 미션 완료 처리를 취소합니다.
 */
export async function DELETE(request: NextRequest) {
  const result = await getCurrentParticipant(request);

  if ('response' in result) {
    return result.response;
  }

  const reqBody = await request.json().catch(() => ({}));
  const missionId = reqBody.missionId;

  if (typeof missionId !== 'number') {
    return badRequest('올바른 missionId가 필요합니다.');
  }

  // 1. 완료 레코드 삭제
  const { error } = await supabase
    .from('mission_completions')
    .delete()
    .eq('events_id', result.participant.events_id)
    .eq('participant_users_id', result.participant.id)
    .eq('missions_id', missionId);

  if (error) {
    return serverError('미션 완료 취소 실패', error);
  }

  return ok({ success: true, message: '미션 완료 취소 완료' });
}
// TODO: [테스트용 코드 - 배포 전 삭제] - END
