import { Info } from "lucide-react";
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
  info: string;
};

const DashboardKpiCard = ({
  title,
  icon,
  countData,
  colorClassNames,
  info,
}: Props) => {
  const todayCount = formatNumber(countData.today);
  const totalCount = formatNumber(countData.total);
  const shouldStackTotalCount = `${todayCount} / ${totalCount}`.length > 22;
  const tooltipParenthesisIndex = info.indexOf("(");
  const hasTooltipParenthesis = tooltipParenthesisIndex !== -1;

  return (
    <section
      aria-label={title}
      className="relative flex min-h-30 items-center gap-4 rounded-xl border border-gomin-neutral-100 bg-white p-4 pr-11"
    >
      <div className="group/info absolute top-2 right-2">
        <button
          type="button"
          aria-label={`${title} 기준: ${info}`}
          className="grid size-6 place-items-center rounded-full bg-white text-gomin-neutral-400 transition hover:text-gomin-primary-700 focus-visible:ring-2 focus-visible:ring-gomin-primary-300 focus-visible:outline-none"
        >
          <Info className="size-3.5" aria-hidden="true" />
        </button>
        <div className="pointer-events-none absolute bottom-8 right-0 z-10 w-max max-w-[calc(100vw-2rem)] rounded-lg border border-gomin-neutral-100 bg-white/90 px-3 py-2 text-right text-xs leading-5 font-medium whitespace-nowrap text-gomin-neutral-600 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition group-hover/info:opacity-100 group-focus-within/info:opacity-100">
          {hasTooltipParenthesis ? (
            <>
              <span className="block">
                {info.slice(0, tooltipParenthesisIndex).trim()}
              </span>
              <span className="block">
                {info.slice(tooltipParenthesisIndex).trim()}
              </span>
            </>
          ) : (
            info
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-xl mx-1",
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
                / {totalCount}명
              </div>
            )}
          </div>
          {shouldStackTotalCount && (
            <div className="mt-2 -translate-y-[3px] whitespace-nowrap text-right leading-none tracking-[0.03em] text-gomin-neutral-400">
              / {totalCount}명
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardKpiCard;
