"use client";

import { useCallback, useEffect, useRef } from "react";
import { Check, Gift, Users, Zap } from "lucide-react";
import DashboardKpiCard from "@/components/admin/dashboard/DashboardKpiCard";
import MissionCompletionStatus from "@/components/admin/dashboard/MissionCompletionStatus";
import dynamic from "next/dynamic";

const ParticipantAnalysisChart = dynamic(
  () => import("@/components/admin/dashboard/ParticipantAnalysisChart")
);
const ParticipantDemographicsChart = dynamic(
  () => import("@/components/admin/dashboard/ParticipantDemographicsChart")
);
import {
  useAdminDashboardAchieverStatisticsQuery,
  useAdminDashboardKpisQuery,
  useAdminDashboardMissionsQuery,
  useAdminDashboardParticipantAnalysisQuery,
} from "@/features/admin/dashboard/adminDashboardQueries";
import { useDashboardKpiBroadcast } from "@/hooks/useDashboardKpiBroadcast";
import type {
  AdminDashboardKpiKey,
  AdminDashboardKpisResponse,
} from "@/types/admin-dashboard";

type Props = {
  eventId: number;
};

const dashboardPanelClassName =
  "min-w-0 rounded-xl border border-gomin-neutral-100 bg-white";

const emptyKpis: AdminDashboardKpisResponse = {
  participants: { today: 0, total: 0 },
  missionInProgress: { today: 0, total: 0 },
  missionCompleted: { today: 0, total: 0 },
  rewardClaimed: { today: 0, total: 0 },
};

const dashboardCardMeta: {
  key: AdminDashboardKpiKey;
  title: string;
  info: string;
  icon: React.ReactNode;
  colorClassNames: {
    icon: string;
    value: string;
  };
}[] = [
  {
    key: "participants",
    title: "참여자 수",
    info: "오늘 입장한 참여자 수 / 행사 전체 참여자 수",
    icon: <Users className="size-6" aria-hidden="true" />,
    colorClassNames: {
      icon: "bg-[#EEF4FF] text-[#4D7CFE]",
      value: "text-[#4D7CFE]",
    },
  },
  {
    key: "missionInProgress",
    title: "미션 진행 중",
    info: "오늘 미션 진행 중 참여자 수 / 오늘 참여자 수 (미션 전체 완료자 제외)",
    icon: <Zap className="size-6" aria-hidden="true" />,
    colorClassNames: {
      icon: "bg-[#FFF1D6] text-[#F59E0B]",
      value: "text-[#F59E0B]",
    },
  },
  {
    key: "missionCompleted",
    title: "미션 전체 완료",
    info: "오늘 미션 전체 완료자 수 / 오늘 미션 진행 중 참여자 수",
    icon: <Check className="size-6" aria-hidden="true" />,
    colorClassNames: {
      icon: "bg-[#DDF7ED] text-[#20B486]",
      value: "text-[#20B486]",
    },
  },
  {
    key: "rewardClaimed",
    title: "굿즈 수령 완료",
    info: "굿즈 수령 완료자 수 / 행사 전체 미션 전체 완료자 수",
    icon: <Gift className="size-6" aria-hidden="true" />,
    colorClassNames: {
      icon: "bg-[#F3F1FE] text-[#5435EB]",
      value: "text-[#5435EB]",
    },
  },
];

const DashboardClient = ({ eventId }: Props) => {
  const kpisQuery = useAdminDashboardKpisQuery(eventId);
  const participantAnalysisQuery =
    useAdminDashboardParticipantAnalysisQuery(eventId);
  const achieverStatisticsQuery =
    useAdminDashboardAchieverStatisticsQuery(eventId);
  const missionsQuery = useAdminDashboardMissionsQuery(eventId);
  const { data: kpisData, refetch: refetchKpisQuery } = kpisQuery;
  const { data: participantAnalysis, refetch: refetchParticipantAnalysis } =
    participantAnalysisQuery;
  const { data: achieverStatistics, refetch: refetchAchieverStatistics } =
    achieverStatisticsQuery;
  const { data: missions, refetch: refetchMissions } = missionsQuery;

  const refetchKpis = useCallback(() => {
    if (isValidEventId(eventId)) {
      void refetchKpisQuery();
    }
  }, [eventId, refetchKpisQuery]);

  const refetchAllDashboardData = useCallback(() => {
    if (!isValidEventId(eventId)) {
      return;
    }

    void refetchKpisQuery();
    void refetchParticipantAnalysis();
    void refetchAchieverStatistics();
    void refetchMissions();
  }, [
    eventId,
    refetchAchieverStatistics,
    refetchKpisQuery,
    refetchMissions,
    refetchParticipantAnalysis,
  ]);

  const isEventIdValid = isValidEventId(eventId);

  useDashboardKpiBroadcast({
    eventId,
    enabled: isEventIdValid,
    onInvalidate: refetchKpis,
  });
  useAlignedMinuteRefetch(refetchAllDashboardData, isEventIdValid);

  const kpis = kpisData ?? emptyKpis;

  return (
    <div className="px-8 pt-0">
      <div className="mt-8 grid grid-cols-4 gap-4">
        {dashboardCardMeta.map((card) => (
          <DashboardKpiCard
            key={card.key}
            title={card.title}
            countData={kpis[card.key]}
            icon={card.icon}
            colorClassNames={card.colorClassNames}
            info={card.info}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-8 flex min-w-0 flex-col gap-4">
          <section
            aria-label="참여자 수 분석"
            className={`${dashboardPanelClassName} overflow-hidden`}
          >
            <ParticipantAnalysisChart
              daily={participantAnalysis?.daily ?? []}
              hourlyTotal={participantAnalysis?.hourlyTotal ?? []}
              hourlyDateFactors={participantAnalysis?.hourlyDateFactors ?? []}
            />
          </section>

          <section
            aria-label="달성자 통계"
            className={`${dashboardPanelClassName} overflow-hidden`}
          >
            <ParticipantDemographicsChart
              totalRespondents={achieverStatistics?.totalRespondents ?? 0}
              genderData={achieverStatistics?.gender ?? []}
              ageData={achieverStatistics?.ageRange ?? []}
            />
          </section>
        </div>

        <div className="col-span-4 flex min-w-0 flex-col gap-4">
          <section
            aria-label="미션별 완료 현황"
            className={`${dashboardPanelClassName} overflow-visible`}
          >
            <MissionCompletionStatus missions={missions?.missions ?? []} />
          </section>
        </div>
      </div>
    </div>
  );
};

const useAlignedMinuteRefetch = (callback: () => void, enabled: boolean) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let intervalId: number | undefined;
    const now = Date.now();
    const remainder = now % 60000;
    const delay = remainder === 0 ? 60000 : 60000 - remainder;

    const timeoutId = window.setTimeout(() => {
      callbackRef.current();
      intervalId = window.setInterval(() => {
        callbackRef.current();
      }, 60000);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);

      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [enabled]);
};

const isValidEventId = (eventId: number): eventId is number =>
  Number.isInteger(eventId) && eventId > 0;

export default DashboardClient;
