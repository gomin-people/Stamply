import { Check, Gift, Users, Zap } from "lucide-react";
import DashboardKpiCard from "@/components/admin/dashboard/DashboardKpiCard";
import MissionCompletionStatus from "@/components/admin/dashboard/MissionCompletionStatus";
import ParticipantAnalysisChart from "@/components/admin/dashboard/ParticipantAnalysisChart";
import ParticipantDemographicsChart from "@/components/admin/dashboard/ParticipantDemographicsChart";
import achieverStatisticsData from "@/mocks/dashboard/achiever-statistics.json";
import dashboardKpis from "@/mocks/dashboard/kpis.json";
import dashboardMissions from "@/mocks/dashboard/missions.json";
import participantAnalysisData from "@/mocks/dashboard/participant-analysis.json";

const dashboardPanelClassName =
  "rounded-xl border border-gomin-neutral-100 bg-white";

const dashboardCardMeta = [
  {
    key: "participants",
    title: "참여자 수",
    icon: <Users className="size-6" aria-hidden="true" />,
    colorClassNames: {
      icon: "bg-[#EEF4FF] text-[#4D7CFE]",
      value: "text-[#4D7CFE]",
    },
  },
  {
    key: "missionInProgress",
    title: "미션 진행 중",
    icon: <Zap className="size-6" aria-hidden="true" />,
    colorClassNames: {
      icon: "bg-[#FFF1D6] text-[#F59E0B]",
      value: "text-[#F59E0B]",
    },
  },
  {
    key: "missionCompleted",
    title: "미션 전체 완료",
    icon: <Check className="size-6" aria-hidden="true" />,
    colorClassNames: {
      icon: "bg-[#DDF7ED] text-[#20B486]",
      value: "text-[#20B486]",
    },
  },
  {
    key: "rewardClaimed",
    title: "굿즈 수령 완료",
    icon: <Gift className="size-6" aria-hidden="true" />,
    colorClassNames: {
      icon: "bg-[#F3F1FE] text-[#5435EB]",
      value: "text-[#5435EB]",
    },
  },
] as const;

const dashboardCounts = dashboardKpis as Record<
  (typeof dashboardCardMeta)[number]["key"],
  { today: number; total: number }
>;

const DashboardPage = () => {
  return (
    <div className="px-8 pt-0 pb-8">
      <div className="grid grid-cols-4 gap-4 mt-8">
        {dashboardCardMeta.map((card) => (
          <DashboardKpiCard
            key={card.key}
            title={card.title}
            countData={dashboardCounts[card.key]}
            icon={card.icon}
            colorClassNames={card.colorClassNames}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-8 flex flex-col gap-4">
          <section
            aria-label="참여자 수 분석"
            className={`${dashboardPanelClassName} overflow-hidden`}
          >
            <ParticipantAnalysisChart
              daily={participantAnalysisData.daily}
              hourlyTotal={participantAnalysisData.hourlyTotal}
              hourlyDateFactors={participantAnalysisData.hourlyDateFactors}
            />
          </section>

          <section
            aria-label="달성자 통계"
            className={`${dashboardPanelClassName} overflow-hidden`}
          >
            <ParticipantDemographicsChart
              totalAchievers={achieverStatisticsData.totalAchievers}
              genderData={achieverStatisticsData.gender}
              ageData={achieverStatisticsData.ageRange}
            />
          </section>
        </div>

        <div className="col-span-4 flex flex-col gap-4">
          <section
            aria-label="미션별 완료 현황"
            className={`${dashboardPanelClassName} overflow-visible`}
          >
            <MissionCompletionStatus missions={dashboardMissions.missions} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
