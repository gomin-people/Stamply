"use client";

import { useMemo, useState } from "react";
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

type AnalysisView = "daily" | "hourlyTotal" | "hourlyDate";

type DailyParticipantData = {
  label: string;
  count: number;
};

type HourlyParticipantData = {
  hour: number;
  label: string;
  count: number;
  fill: string;
};

const analysisTabs: {
  value: AnalysisView;
  label: string;
}[] = [
  { value: "daily", label: "날짜별" },
  { value: "hourlyTotal", label: "시간대별(전체)" },
  { value: "hourlyDate", label: "시간대별(날짜)" },
];

const dailyParticipantData: DailyParticipantData[] = [
  { label: "6/1", count: 1810 },
  { label: "6/2", count: 2330 },
  { label: "6/3", count: 2140 },
  { label: "6/4", count: 3120 },
  { label: "6/5", count: 3680 },
  { label: "6/6", count: 4290 },
  { label: "6/7", count: 4800 },
];

const chartColor = "#5435EB";
const chartSoftColor = "#C8BEFA";
const chartGridColor = "#ECECEC";
const eventDateOptions = dailyParticipantData.map((item) => item.label);

const hourlyParticipantData: HourlyParticipantData[] = [
  4, 2, 1, 0, 0, 0, 15, 80, 205, 415, 635, 805, 915, 835, 720, 690, 1010, 1380,
  1620, 1490, 980, 540, 255, 115,
].map((count, hour) => ({
  hour,
  label: `${hour}시`,
  count,
  fill: hour >= 17 && hour <= 20 ? chartColor : chartSoftColor,
}));

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

const ParticipantAnalysisChart = () => {
  const [activeView, setActiveView] = useState<AnalysisView>("daily");
  const [selectedDate, setSelectedDate] = useState(eventDateOptions[0]);
  const selectedDateHourlyData = useMemo(
    () => getHourlyDataByDate(selectedDate),
    [selectedDate]
  );

  return (
    <div className="flex h-full min-h-88 flex-col px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-row items-end gap-3">
          <h2 className="text-lg font-semibold text-gomin-black">
            참여자 수 분석
          </h2>
          <p className="text-sm font-medium text-gomin-neutral-400">
            시간에 따른 참여 패턴 확인
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeView === "hourlyDate" && (
            <select
              aria-label="날짜 선택"
              value={selectedDate}
              className="h-10 w-[88px] rounded-lg border border-gomin-neutral-100 bg-white px-3 text-xs font-semibold text-gomin-neutral-600 outline-none"
              onChange={(event) => setSelectedDate(event.target.value)}
            >
              {eventDateOptions.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          )}

          <div
            role="tablist"
            aria-label="참여자 수 분석 보기"
            className="grid h-10 w-[310px] grid-cols-3 rounded-lg bg-[#F4F4F4] p-1"
          >
            {analysisTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={activeView === tab.value}
                className={cn(
                  "rounded-lg px-3 text-xs font-semibold text-gomin-neutral-400 transition",
                  "focus-visible:ring-2 focus-visible:ring-gomin-primary-300 focus-visible:outline-none",
                  activeView === tab.value &&
                    "bg-white text-gomin-black shadow-[0_1px_6px_rgba(0,0,0,0.08)]"
                )}
                onClick={() => setActiveView(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1">
        {activeView === "daily" && <DailyAreaChart />}
        {activeView === "hourlyTotal" && (
          <HourlyBarChart data={hourlyParticipantData} />
        )}
        {activeView === "hourlyDate" && (
          <HourlyBarChart data={selectedDateHourlyData} />
        )}
      </div>
    </div>
  );
};

const DailyAreaChart = () => {
  return (
    <ChartContainer
      config={dailyChartConfig}
      className="aspect-auto h-[260px] [&_.recharts-cartesian-axis-tick_text]:fill-gomin-neutral-400"
      initialDimension={{ width: 760, height: 260 }}
    >
      <AreaChart
        accessibilityLayer
        data={dailyParticipantData}
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
          domain={[0, 5000]}
          ticks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]}
          tickFormatter={formatChartTick}
        />
        <ChartTooltip
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

const HourlyBarChart = ({ data }: { data: HourlyParticipantData[] }) => {
  return (
    <ChartContainer
      config={hourlyChartConfig}
      className="aspect-auto h-[260px] [&_.recharts-cartesian-axis-tick_text]:fill-gomin-neutral-400"
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
          domain={[0, 1800]}
          ticks={[0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800]}
          tickFormatter={formatChartTick}
        />
        <ChartTooltip
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

function formatChartTick(value: number) {
  if (value < 1000) {
    return `${value}`;
  }

  const compactValue = value / 1000;
  return Number.isInteger(compactValue)
    ? `${compactValue}k`
    : `${compactValue.toFixed(1)}k`;
}

function getHourlyDataByDate(date: string): HourlyParticipantData[] {
  const dateIndex = Math.max(eventDateOptions.indexOf(date), 0);
  const factor = [0.82, 0.9, 0.86, 0.94, 0.98, 1.08, 1.04][dateIndex] ?? 1;

  return hourlyParticipantData.map((item) => ({
    ...item,
    count: Math.round(item.count * factor),
  }));
}

export default ParticipantAnalysisChart;
