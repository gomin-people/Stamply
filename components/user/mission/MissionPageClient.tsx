"use client";

import { useState, memo } from "react";
import { useRouter } from "next/navigation";
import BrochureButton from "@/components/user/mission/BrochureButton";
import ViewToggle from "@/components/user/mission/ViewToggle";
import MissionStamp from "@/components/user/mission/MissionStamp";
import MissionItem from "@/components/user/mission/MissionItem";
import FloatingActionButton from "@/components/user/mission/FloatingActionButton";
import SurveyModal from "@/components/user/mission/SurveyModal";
import {
  useParticipantMissionsQuery,
  type ParticipantMission,
  type ParticipantMissions,
} from "@/features/participant/missions/participantMissionQueries";
import { cn } from "@/utils";
import { buildInitialData } from "@/utils/participant-mission";
import { type ParticipantModel } from "@/types/models";

// Supabase의 event 테이블 타입 인터페이스 정의
type EventData = {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  stampImageUrl?: string | null;
};

type InitialMission = {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
};

type MissionPageClientProps = {
  event: EventData;
  eventId: string;
  initialMissions: InitialMission[];
  initialParticipant?: ParticipantModel;
  isPreview?: boolean;
};

type ViewMode = "list" | "grid";

type ClientMission = {
  id: number;
  title: string;
  description: string;
  isStamped: boolean;
};

const MissionPageClient = ({
  event,
  eventId,
  initialMissions,
  initialParticipant,
  isPreview = false,
}: MissionPageClientProps) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  const initialData: ParticipantMissions | undefined =
    !isPreview && initialMissions.length > 0
      ? buildInitialData(initialMissions, initialParticipant)
      : undefined;

  // React Query를 통해 DB에서 참여자의 실시간 완료 스탬프 현황 데이터를 가져옴
  const { data, isError, isFetching } = useParticipantMissionsQuery({
    enabled: !isPreview,
    initialData,
  });

  // 1순위: 로그인/참여 완료 세션 정보가 반영된 React Query 실시간 데이터
  // 2순위: 서버 컴포넌트에서 pre-fetch해 준 원본 미션 목록 데이터 (서버 완료 상태 반영)
  const missions: ClientMission[] =
    data && !isPreview
      ? (data.missions as ParticipantMission[]).map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description ?? "",
          isStamped: m.isCompleted,
        }))
      : initialMissions.map((m: InitialMission) => ({
          id: m.id,
          title: m.title,
          description: m.description ?? "",
          isStamped: !!m.isCompleted,
        }));

  // 미완료된 미션 수 계산
  const incompleteCount = missions.filter((m) => !m.isStamped).length;
  const isAllCompleted = incompleteCount === 0;

  // 설문조사 완료 여부 (성별/연령대 입력 여부)
  const isSurveyCompleted =
    data && !isPreview
      ? !!data.participant.gender && !!data.participant.ageRange
      : false;

  // 리워드 수령 완료 여부
  const isRewardClaimed =
    data && !isPreview ? data.participant.isRewardClaimed : false;

  const hasError = isError && !isPreview;
  const isMissionsEmpty = missions.length === 0 && !isPreview;
  const isShowEmpty = hasError || isMissionsEmpty;
  const showBrochureButton = isPreview || !hasError;
  const showMissionUI = isPreview || (showBrochureButton && !isMissionsEmpty);

  // QR 체크 안내 또는 완료 페이지 이동
  const handleAction = () => {
    if (isAllCompleted) {
      if (isSurveyCompleted) {
        router.push(`/event/${eventId}/complete`);
      } else {
        setIsSurveyOpen(true);
      }
    } else {
      window.location.assign(`/event/${eventId}/qr-check`);
    }
  };

  const handleSurveySubmitSuccess = () => {
    router.push(`/event/${eventId}/complete`);
  };

  // DB에서 불러온 title (또는 name)을 1순위로 사용하며 예외 처리 제공
  const eventName = event?.title || event?.name || `이벤트 #${eventId}`;

  return (
    <div
      className={cn(
        "flex flex-col relative bg-gomin-white",
        isPreview
          ? "h-full pb-20"
          : isShowEmpty
            ? "h-full overflow-hidden"
            : viewMode === "list"
              ? "min-h-screen pb-20"
              : "pb-21.5"
      )}
    >
      <main className="flex-1 max-w-md w-full mx-auto px-6 pt-4 pb-1.5 overflow-x-hidden">
        {/* 2. 타이틀 & 브로슈어 안내장 버튼 레이아웃 */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <h1 className="text-4xl font-nanum font-extrabold leading-11.25 text-gomin-primary-700 tracking-tight select-none">
            {eventName}
          </h1>
          {/* 우측 별도 컴포넌트로 보여지는 브로슈어 버튼 */}
          {showBrochureButton && <BrochureButton eventId={eventId} />}
        </div>

        {/* 3. 진행 상황 안내 문구 */}
        {showMissionUI && (
          <div className="mb-4 min-h-14 flex items-center">
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
        {showMissionUI && (
          <div className="flex justify-end mb-5">
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          </div>
        )}

        {/* 5. 미션 뷰 렌더링 영역 */}
        <div className="transition-all duration-300">
          {isShowEmpty ? (
            <div className="flex flex-col items-center justify-center pb-20 pt-40 text-center select-none">
              <p className="text-[128px] font-nanum font-extrabold text-gomin-primary-700 leading-none">
                텅
              </p>
              <p className="text-2xl font-nanum font-extrabold text-gomin-black mt-4">
                이런.. 미션이 없어요..
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* 스탬프 뷰: 격자형 정사각형 카드 */
            <div className="grid grid-cols-2 gap-4">
              {missions.map((mission) => (
                <MissionStamp
                  key={mission.id}
                  mission={mission}
                  stampImageUrl={event.stampImageUrl}
                />
              ))}
            </div>
          ) : (
            /* 리스트 뷰: 가로형 카드 */
            <div className="flex flex-col gap-4">
              {missions.map((mission) => (
                <MissionItem
                  key={mission.id}
                  mission={mission}
                  stampImageUrl={event.stampImageUrl}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 6. 하단 고정 플로팅 액션 버튼 */}
      {showMissionUI && (
        <FloatingActionButton
          isAllCompleted={isAllCompleted}
          onClick={handleAction}
          isPreview={isPreview}
          isRewardClaimed={isRewardClaimed}
          isLoading={isFetching && !isPreview}
        />
      )}

      {/* 설문조사 모달 */}
      <SurveyModal
        isOpen={isSurveyOpen && !isSurveyCompleted}
        onClose={() => setIsSurveyOpen(false)}
        onSubmitSuccess={handleSurveySubmitSuccess}
      />
    </div>
  );
};

export default memo(MissionPageClient);
