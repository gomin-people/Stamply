import { Check, Gift, Users, Zap } from "lucide-react";
import DashboardKpiCard from "@/components/admin/dashboard/DashboardKpiCard";
import MissionCompletionStatus from "@/components/admin/dashboard/MissionCompletionStatus";
import ParticipantAnalysisChart from "@/components/admin/dashboard/ParticipantAnalysisChart";
import ParticipantDemographicsChart from "@/components/admin/dashboard/ParticipantDemographicsChart";

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

const dashboardCounts: Record<
  (typeof dashboardCardMeta)[number]["key"],
  { today: number; total: number }
> = {
  participants: { today: 2123423, total: 2567890000000 },
  missionInProgress: { today: 7520, total: 18240 },
  missionCompleted: { today: 14109, total: 24381 },
  rewardClaimed: { today: 9847, total: 14109 },
};

const missionCompletionData = [
  {
    id: 1,
    title:
      "슈가버블 · 솜사탕 스탬프슈가버블 · 솜사탕 스탬프슈가버블 · 솜사탕 스탬프",
    completedCount: 7128712,
    completionRate: 92.4,
  },
  {
    id: 2,
    title: "노티드 · 도넛 미션",
    completedCount: 6802,
    completionRate: 88.1,
  },
  {
    id: 3,
    title: "블루보틀 · 컵 디자인",
    completedCount: 6302,
    completionRate: 81.7,
  },
  {
    id: 4,
    title: "어메이즈 · 포토부스",
    completedCount: 5887,
    completionRate: 76.3,
  },
  {
    id: 5,
    title: "마뗑킴 · 시즌 굿즈",
    completedCount: 5244,
    completionRate: 68.0,
  },
  {
    id: 6,
    title: "아우어홈 · 인증샷 챌린지",
    completedCount: 4189,
    completionRate: 54.3,
  },
  {
    id: 7,
    title: "젠틀몬스터 · QR 미션",
    completedCount: 3521,
    completionRate: 45.7,
  },
  {
    id: 8,
    title: "코오롱 · 친환경 굿즈 수령",
    completedCount: 2108,
    completionRate: 27.4,
  },
  {
    id: 9,
    title: "탬버린즈 · 향기 카드",
    completedCount: 1784,
    completionRate: 23.2,
  },
  {
    id: 10,
    title: "아더에러 · 스타일 체크",
    completedCount: 1216,
    completionRate: 15.8,
  },
];

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
            <ParticipantAnalysisChart />
          </section>

          <section
            aria-label="달성자 통계"
            className={`${dashboardPanelClassName} overflow-hidden`}
          >
            <ParticipantDemographicsChart />
          </section>
        </div>

        <div className="col-span-4 flex flex-col gap-4">
          <section
            aria-label="미션별 완료 현황"
            className={`${dashboardPanelClassName} overflow-visible`}
          >
            <MissionCompletionStatus missions={missionCompletionData} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
