import { Check, Gift, Users, Zap } from "lucide-react";
import DashboardKpiCard from "@/components/admin/dashboard/DashboardKpiCard";

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

const DashboardPage = () => {
  return (
    <div className="p-8 pt-1">
      <div className="mb-2 flex justify-end">
        <span className="text-sm text-gomin-neutral-400">오늘 / 전체 기준</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
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
            className={`${dashboardPanelClassName} min-h-88`}
          >
            {/* 날짜별/시간대별/피크 시간대 참여자 추이 차트 */}
          </section>

          <section
            aria-label="참여자 인구통계"
            className={`${dashboardPanelClassName} min-h-76`}
          >
            {/* 성별 분포, 연령대 분포, 설문 응답률 */}
          </section>
        </div>

        <div className="col-span-4 flex flex-col gap-4">
          <section
            aria-label="미션별 완료 현황"
            className={`${dashboardPanelClassName} min-h-168`}
          >
            {/* 미션명, 완료자 수, 완료율, 진행률 바 */}
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
