import { cn, formatNumber } from "@/utils";

type Props = {
  title: string;
  icon: React.ReactNode;
  countData: {
    today: number;
    total: number;
  };
  colorClassNames: {
    icon: string;
    value: string;
  };
};

const DashboardKpiCard = ({
  title,
  icon,
  countData,
  colorClassNames,
}: Props) => {
  const todayCount = formatNumber(countData.today);
  const totalCount = formatNumber(countData.total);
  const shouldStackTotalCount = `${todayCount} / ${totalCount}`.length > 22;

  return (
    <section
      aria-label={title}
      className="flex min-h-30 items-center gap-4 rounded-xl border border-gomin-neutral-100 bg-white p-4"
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-xl",
          colorClassNames.icon
        )}
      >
        {icon}
      </div>
      <div className="flex h-16 min-w-0 flex-1 translate-y-0.5 flex-col gap-2">
        <div className="-translate-y-1 text-sm font-medium text-gomin-neutral-500">
          {title}
        </div>
        <div className="min-w-0">
          <div
            className={cn(
              "flex min-w-0 items-baseline gap-x-1 whitespace-nowrap",
              shouldStackTotalCount ? "-translate-y-1" : "translate-y-1"
            )}
          >
            <div
              className={cn(
                "shrink-0 text-3xl font-semibold leading-none",
                colorClassNames.value
              )}
            >
              {todayCount}
            </div>
            {!shouldStackTotalCount && (
              <div className="shrink-0 leading-none tracking-[0.03em] text-gomin-neutral-400">
                / {totalCount}
              </div>
            )}
          </div>
          {shouldStackTotalCount && (
            <div className="mt-2 -translate-y-[3px] whitespace-nowrap text-right leading-none tracking-[0.03em] text-gomin-neutral-400">
              / {totalCount}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardKpiCard;
