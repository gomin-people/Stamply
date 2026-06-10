"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/utils";
import { getRankedBarColors } from "@/components/admin/dashboard/rankedBarColors";

type AnalysisView = "daily" | "hourly";

type DailyParticipantData = {
  label: string;
  count: number;
};

type HourlyParticipantData = {
  hour: number;
  label: string;
  count: number;
};

type HourlyParticipantBarData = HourlyParticipantData & {
  fill: string;
};

type HourlyDateFactor = {
  label: string;
  factor: number;
};

type Props = {
  daily: DailyParticipantData[];
  hourlyTotal: HourlyParticipantData[];
  hourlyDateFactors: HourlyDateFactor[];
};

const analysisTabs: {
  value: AnalysisView;
  label: string;
}[] = [
  { value: "daily", label: "날짜별" },
  { value: "hourly", label: "시간대별" },
];

const HOURLY_TOTAL_OPTION_VALUE = "total";
const ADMIN_DASHBOARD_TIME_ZONE = "Asia/Seoul";

const chartColor = "#5435EB";
const chartSoftColor = "#C8BEFA";
const chartGridColor = "#ECECEC";

const dailyChartConfig = {
  count: {
    label: "참여자",
    color: chartColor,
  },
} satisfies ChartConfig;

const hourlyChartConfig = {
  count: {
    label: "참여자",
    color: chartColor,
  },
} satisfies ChartConfig;

const ParticipantAnalysisChart = ({
  daily,
  hourlyTotal,
  hourlyDateFactors,
}: Props) => {
  const [activeView, setActiveView] = useState<AnalysisView>("daily");
  const eventDateOptions = useMemo(
    () => daily.map((item) => item.label),
    [daily]
  );
  const [selectedHourlyFilter, setSelectedHourlyFilter] =
    useState(getTodayDateOption);
  const selectedHourlyFilterValue =
    selectedHourlyFilter === HOURLY_TOTAL_OPTION_VALUE ||
    eventDateOptions.includes(selectedHourlyFilter)
      ? selectedHourlyFilter
      : HOURLY_TOTAL_OPTION_VALUE;
  const hourlyTotalData = useMemo(
    () => withHourlyFill(hourlyTotal),
    [hourlyTotal]
  );
  const selectedHourlyData = useMemo(
    () =>
      selectedHourlyFilterValue === HOURLY_TOTAL_OPTION_VALUE
        ? hourlyTotalData
        : getHourlyDataByDate(
            selectedHourlyFilterValue,
            hourlyTotal,
            hourlyDateFactors
          ),
    [selectedHourlyFilterValue, hourlyTotalData, hourlyTotal, hourlyDateFactors]
  );

  return (
    <div className="flex h-full min-h-88 min-w-0 flex-col px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-end gap-x-3 gap-y-1">
          <h2 className="text-lg font-semibold text-gomin-black">
            참여자 수 분석
          </h2>
          <p className="min-w-0 truncate text-sm font-medium text-gomin-neutral-400">
            시간에 따른 참여 패턴 확인
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <AnimatePresence initial={false}>
            {activeView === "hourly" && (
              <motion.div
                key="hourly-filter"
                className="relative"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                <select
                  aria-label="시간대별 범위 선택"
                  value={selectedHourlyFilterValue}
                  className="h-9 w-[80px] cursor-pointer appearance-none rounded-lg border border-gomin-neutral-100 bg-white px-3 pr-7 text-xs font-semibold text-gomin-neutral-600 outline-none"
                  onChange={(event) =>
                    setSelectedHourlyFilter(event.target.value)
                  }
                >
                  <option value={HOURLY_TOTAL_OPTION_VALUE}>전체</option>
                  {eventDateOptions.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-gomin-neutral-400"
                  aria-hidden="true"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            role="tablist"
            aria-label="참여자 수 분석 보기"
            className="grid h-9 w-[150px] grid-cols-2 rounded-lg bg-[#F4F4F4] p-1"
          >
            {analysisTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={activeView === tab.value}
                className={cn(
                  "relative cursor-pointer rounded-lg px-3 text-xs font-semibold text-gomin-neutral-400 transition",
                  "focus-visible:ring-2 focus-visible:ring-gomin-primary-300 focus-visible:outline-none",
                  activeView === tab.value && "text-gomin-black"
                )}
                onClick={() => setActiveView(tab.value)}
              >
                {activeView === tab.value && (
                  <motion.span
                    layoutId="participant-analysis-active-tab"
                    className="absolute inset-0 rounded-lg bg-white shadow-[0_1px_6px_rgba(0,0,0,0.08)]"
                    transition={{ type: "spring", stiffness: 450, damping: 34 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeView}
            className="min-w-0"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {activeView === "daily" && <DailyAreaChart data={daily} />}
            {activeView === "hourly" && (
              <HourlyBarChart data={selectedHourlyData} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const DailyAreaChart = ({ data }: { data: DailyParticipantData[] }) => {
  const yAxisScale = useMemo(() => getCountChartScale(data), [data]);

  return (
    <ChartContainer
      config={dailyChartConfig}
      className="aspect-auto h-[260px] min-w-0 [&_.recharts-cartesian-axis-tick_text]:fill-gomin-neutral-400"
      initialDimension={{ width: 760, height: 260 }}
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 8, bottom: 8, left: 0 }}
      >
        <defs>
          <linearGradient
            id="participant-daily-fill"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop offset="0%" stopColor={chartColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={chartColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={chartGridColor} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tickMargin={14}
          minTickGap={16}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={4}
          width={38}
          domain={yAxisScale.domain}
          ticks={yAxisScale.ticks}
          tickFormatter={formatChartTick}
        />
        <ChartTooltip
          isAnimationActive={false}
          cursor={{ stroke: chartColor, strokeOpacity: 0.16 }}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value) => (
                <span className="font-semibold">
                  {Number(value).toLocaleString("ko-KR")}명
                </span>
              )}
            />
          }
        />
        <Area
          dataKey="count"
          type="monotone"
          fill="url(#participant-daily-fill)"
          stroke={chartColor}
          strokeWidth={3}
          dot={{ r: 5.5, fill: "white", stroke: chartColor, strokeWidth: 3 }}
          activeDot={{
            r: 6,
            fill: "white",
            stroke: chartColor,
            strokeWidth: 3,
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
};

const HourlyBarChart = ({ data }: { data: HourlyParticipantBarData[] }) => {
  const yAxisScale = useMemo(() => getCountChartScale(data), [data]);

  return (
    <ChartContainer
      config={hourlyChartConfig}
      className="aspect-auto h-[260px] min-w-0 [&_.recharts-cartesian-axis-tick_text]:fill-gomin-neutral-400"
      initialDimension={{ width: 760, height: 260 }}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 12, right: 4, bottom: 8, left: 0 }}
      >
        <CartesianGrid vertical={false} stroke={chartGridColor} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tickMargin={12}
          interval={0}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={4}
          width={38}
          domain={yAxisScale.domain}
          ticks={yAxisScale.ticks}
          tickFormatter={formatChartTick}
        />
        <ChartTooltip
          isAnimationActive={false}
          cursor={{ fill: "rgba(84, 53, 235, 0.06)" }}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value) => (
                <span className="font-semibold">
                  {Number(value).toLocaleString("ko-KR")}명
                </span>
              )}
            />
          }
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={28}>
          {data.map((item) => (
            <Cell key={item.hour} fill={item.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

function getCountChartScale(data: Array<{ count: number }>) {
  const maxCount = data.reduce(
    (maxValue, item) => Math.max(maxValue, item.count),
    0
  );

  if (maxCount <= 0) {
    return {
      domain: [0, 5] as [number, number],
      ticks: [0, 1, 2, 3, 4, 5],
    };
  }

  const step = getNiceStep(maxCount / 4);
  const domainMax = Math.max(5, Math.ceil(maxCount / step) * step);
  const ticks = Array.from(
    { length: Math.floor(domainMax / step) + 1 },
    (_, index) => index * step
  );

  return {
    domain: [0, domainMax] as [number, number],
    ticks,
  };
}

function getNiceStep(value: number) {
  if (value <= 1) {
    return 1;
  }

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalizedValue = value / magnitude;

  if (normalizedValue <= 1) {
    return magnitude;
  }

  if (normalizedValue <= 2) {
    return magnitude * 2;
  }

  if (normalizedValue <= 5) {
    return magnitude * 5;
  }

  return magnitude * 10;
}

function formatChartTick(value: number) {
  if (value < 1000) {
    return `${value}`;
  }

  const compactValue = value / 1000;
  return Number.isInteger(compactValue)
    ? `${compactValue}k`
    : `${compactValue.toFixed(1)}k`;
}

function getHourlyDataByDate(
  date: string,
  hourlyTotal: HourlyParticipantData[],
  hourlyDateFactors: HourlyDateFactor[]
): HourlyParticipantBarData[] {
  const factor =
    hourlyDateFactors.find((item) => item.label === date)?.factor ?? 1;

  return withHourlyFill(
    hourlyTotal.map((item) => ({
      ...item,
      count: Math.round(item.count * factor),
    }))
  );
}

function getTodayDateOption() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ADMIN_DASHBOARD_TIME_ZONE,
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return month && day ? `${month}/${day}` : HOURLY_TOTAL_OPTION_VALUE;
}

function withHourlyFill(
  data: HourlyParticipantData[]
): HourlyParticipantBarData[] {
  const colors = getRankedBarColors(data, (item) => item.count, {
    darkColor: chartColor,
    includeInScale: (value) => value > 0,
    lightColor: chartSoftColor,
  });

  return data.map((item, index) => ({
    ...item,
    fill: colors[index],
  }));
}

export default ParticipantAnalysisChart;
