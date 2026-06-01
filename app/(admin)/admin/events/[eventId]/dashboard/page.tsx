import { cn } from "@/utils";

const cardClassName = "rounded-xl border border-gomin-neutral-100 bg-white";

type DashboardCardProps = {
  className?: string;
  children?: React.ReactNode;
  ariaLabel: string;
};

const DashboardCard = ({
  className,
  children,
  ariaLabel,
}: DashboardCardProps) => {
  return (
    <section aria-label={ariaLabel} className={cn(cardClassName, className)}>
      {children}
    </section>
  );
};

const DashboardPage = () => {
  return (
    <div className="p-8 ">
      <div className="grid grid-cols-4 gap-4">
        <DashboardCard ariaLabel="전체 참여자 수" className="min-h-28">
          {/* 전체 참여자 수, 전일/전 시간대 대비 증감률 */}
        </DashboardCard>
        <DashboardCard ariaLabel="미션 진행 중" className="min-h-28">
          {/* 미션을 1개 이상 완료했고 전체 완료 전인 참여자 수 */}
        </DashboardCard>
        <DashboardCard ariaLabel="미션 전체 완료" className="min-h-28">
          {/* 활성 미션을 모두 완료한 참여자 수 */}
        </DashboardCard>
        <DashboardCard ariaLabel="굿즈 수령 완료" className="min-h-28">
          {/* 리워드 수령 완료 수, 수령률 또는 잔여 수량 */}
        </DashboardCard>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-8 flex flex-col gap-4">
          <DashboardCard ariaLabel="참여자 수 분석" className="min-h-90">
            {/* 날짜별/시간대별/피크 시간대 참여자 추이 차트 */}
          </DashboardCard>

          <DashboardCard ariaLabel="참여자 인구통계" className="min-h-76">
            {/* 성별 분포, 연령대 분포, 설문 응답률 */}
          </DashboardCard>
        </div>

        <div className="col-span-4 flex flex-col gap-4">
          <DashboardCard ariaLabel="미션별 완료 현황" className="min-h-170">
            {/* 미션명, 완료자 수, 완료율, 진행률 바 */}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
