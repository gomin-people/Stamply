'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrochureButton from '@/components/user/BrochureButton';
import ViewToggle from '@/components/user/ViewToggle';
import MissionStamp from '@/components/user/MissionStamp';
import MissionItem from '@/components/user/MissionItem';
import FloatingActionButton from '@/components/user/FloatingActionButton';
import { useParticipantMissionsQuery } from '@/features/participant/missions/participantMissionQueries';

// Supabase의 event 테이블 타입 인터페이스 정의
interface EventData {
  id: number;
  title?: string;
  name?: string;
  description?: string;
}

interface InitialMission {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  token?: string | null;
}

interface MissionPageClientProps {
  event: EventData;
  eventId: string;
  initialMissions: InitialMission[];
}

type ViewMode = 'list' | 'grid';

export default function MissionPageClient({
  event,
  eventId,
  initialMissions,
}: MissionPageClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // React Query를 통해 DB에서 참여자의 실시간 완료 스탬프 현황 데이터를 가져옴
  const { data, isError } = useParticipantMissionsQuery();

  // 1순위: 로그인/참여 완료 세션 정보가 반영된 React Query 실시간 데이터
  // 2순위: 서버 컴포넌트에서 pre-fetch해 준 원본 미션 목록 데이터 (서버 완료 상태 반영)
  const missions = data
    ? data.missions.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description ?? '',
        isStamped: m.isCompleted,
        token: m.token ?? null, // QR 토큰 바인딩
      }))
    : initialMissions.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description ?? '',
        isStamped: !!m.isCompleted,
        token: m.token ?? null, // 서버에서 넘겨준 QR 토큰 바인딩
      }));

  // 미완료된 미션 수 계산
  const incompleteCount = missions.filter((m) => !m.isStamped).length;
  const isAllCompleted = incompleteCount === 0;

  const hasError = isError;
  const isMissionsEmpty = missions.length === 0;
  const showBrochureAndActionButtons = !hasError && !isMissionsEmpty;

  // QR 체크 안내 또는 완료 페이지 이동
  const handleAction = () => {
    if (isAllCompleted) {
      router.push(`/event/${eventId}/complete`);
    } else {
      alert(
        '오프라인 부스에 배치된 QR 코드를 카메라로 스캔하여 스탬프를 획득해 주세요!'
      );
    }
  };

  // DB에서 불러온 title (또는 name)을 1순위로 사용하며 예외 처리 제공
  const eventName = event?.title || event?.name || `이벤트 #${eventId}`;

  return (
    <div className="flex flex-col min-h-screen bg-gomin-white pb-28">
      <main className="flex-1 max-w-md w-full mx-auto px-6 pt-4">
        {/* 2. 타이틀 & 브로슈어 안내장 버튼 레이아웃 */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <h1 className="text-4xl font-nanum font-extrabold leading-[45px] text-gomin-primary-700 tracking-tight select-none">
            {eventName}
          </h1>
          {/* 우측 별도 컴포넌트로 보여지는 브로슈어 버튼 */}
          {showBrochureAndActionButtons && <BrochureButton eventId={eventId} />}
        </div>

        {/* 3. 진행 상황 안내 문구 */}
        {showBrochureAndActionButtons && (
          <div className="mb-4 min-h-[56px] flex items-center">
            {!isAllCompleted ? (
              <h2 className="text-2xl font-nanum font-extrabold text-gomin-neutral-700 leading-tight tracking-tight select-none">
                <span className="text-gomin-primary-700 font-nanum font-extrabold">
                  {incompleteCount}개
                </span>
                의 스탬프를 더 모으고
                <br />
                리워드를 받으세요
              </h2>
            ) : (
              <h2 className="text-2xl font-nanum font-extrabold text-gomin-black leading-tight tracking-tight flex items-center gap-1.5 select-none">
                🎉 축하합니다!
                <br />
                모든 스탬프를 수집했어요!
              </h2>
            )}
          </div>
        )}

        {/* 4. UI 선택 토글 버튼 (리스트형 vs 격자형) */}
        {showBrochureAndActionButtons && (
          <div className="flex justify-end mb-5">
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          </div>
        )}

        {/* 5. 미션 뷰 렌더링 영역 */}
        <div className="transition-all duration-300">
          {hasError ? (
            /* 미션을 불러오는데 실패한 경우 Error State 처리 */
            <div className="flex flex-col items-center justify-center py-20 text-center select-none">
              <span className="text-4xl mb-4">⚠️</span>
              <p className="text-gomin-neutral-500 font-sans font-bold text-[16px] leading-tight">
                미션 목록을 불러오지 못했습니다.
                <br />
                네트워크 상태를 확인하고 다시 시도해 주세요.
              </p>
            </div>
          ) : isMissionsEmpty ? (
            /* 등록된 미션이 없는 경우 Empty State 처리 */
            <div className="flex flex-col items-center justify-center py-20 text-center select-none">
              <span className="text-4xl mb-4">📭</span>
              <p className="text-gomin-neutral-500 font-sans font-bold text-[16px] leading-tight">
                등록된 미션이 없습니다.
                <br />
                관리자에게 문의해 주세요.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* 스탬프 뷰: 격자형 정사각형 카드 */
            <div className="grid grid-cols-2 gap-4">
              {missions.map((mission) => (
                <MissionStamp key={mission.id} mission={mission} />
              ))}
            </div>
          ) : (
            /* 리스트 뷰: 가로형 카드 */
            <div className="flex flex-col gap-4">
              {missions.map((mission) => (
                <MissionItem key={mission.id} mission={mission} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 6. 하단 고정 플로팅 액션 버튼 */}
      {showBrochureAndActionButtons && (
        <FloatingActionButton
          isAllCompleted={isAllCompleted}
          onClick={handleAction}
        />
      )}
    </div>
  );
}
