"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  type ScatterProps,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/utils";

type AnalysisView = "daily" | "hourly" | "peak";

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

type PeakParticipantData = {
  day: string;
  dayIndex: number;
  hour: number;
  count: number;
  fill: string;
};

type HeatmapCellShapeProps = {
  cx?: number;
  cy?: number;
  payload?: PeakParticipantData;
};

type PeakTooltipPayload = {
  payload: PeakParticipantData;
};

type PeakTooltipProps = {
  active?: boolean;
  payload?: PeakTooltipPayload[];
};

const analysisTabs: {
  value: AnalysisView;
  label: string;
}[] = [
  { value: "daily", label: "날짜별" },
  { value: "hourly", label: "시간대별" },
  { value: "peak", label: "피크 시간대" },
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
const heatmapColors = [
  "#F0EEFF",
  "#E4DFFD",
  "#D2C9FA",
  "#B9AAF4",
  "#9480EC",
  "#735CE6",
  "#5435EB",
];
const heatmapDays = ["월", "화", "수", "목", "금", "토", "일"];
const heatmapHours = Array.from({ length: 24 }, (_, hour) => hour);
const selectedPeakCell = {
  day: "화",
  hour: 18,
};

const hourlyParticipantData: HourlyParticipantData[] = [
  4, 2, 1, 0, 0, 0, 15, 80, 205, 415, 635, 805, 915, 835, 720, 690, 1010, 1380,
  1620, 1490, 980, 540, 255, 115,
].map((count, hour) => ({
  hour,
  label: `${hour}시`,
  count,
  fill: hour >= 17 && hour <= 20 ? chartColor : chartSoftColor,
}));

const peakParticipantData: PeakParticipantData[] = heatmapDays.flatMap(
  (day, dayIndex) =>
    heatmapHours.map((hour) => {
      const eveningPeak = Math.exp(-Math.pow(hour - 18, 2) / 24);
      const lunchPeak = Math.exp(-Math.pow(hour - 12, 2) / 18);
      const dayFactor = [0.86, 1, 0.83, 0.8, 0.78, 0.92, 0.88][dayIndex];
      const count = Math.round(
        (36 + eveningPeak * 520 + lunchPeak * 180) * dayFactor
      );
      const cellCount =
        day === selectedPeakCell.day && hour === selectedPeakCell.hour
          ? 557
          : count;

      return {
        day,
        dayIndex,
        hour,
        count: cellCount,
        fill: getHeatmapColor(cellCount),
      };
    })
);
const selectedPeakData = peakParticipantData.find(
  (item) =>
    item.day === selectedPeakCell.day && item.hour === selectedPeakCell.hour
);

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

const peakChartConfig = {
  count: {
    label: "참여자",
    color: chartColor,
  },
} satisfies ChartConfig;

const ParticipantAnalysisChart = () => {
  const [activeView, setActiveView] = useState<AnalysisView>("daily");

  return (
    <div className="flex h-full min-h-88 flex-col px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-row items-end gap-3">
          <h2 className="text-lg font-semibold text-gomin-black">
            참여자 수 분석
          </h2>
          <p className="text-sm font-medium text-gomin-neutral-400">
            시간에 따른 참여 패턴을 확인하세요
          </p>
        </div>

        <div
          role="tablist"
          aria-label="참여자 수 분석 보기"
          className="grid h-11 w-[292px] grid-cols-3 rounded-xl bg-[#F4F4F4] p-1"
        >
          {analysisTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={activeView === tab.value}
              className={cn(
                "rounded-lg px-3 text-sm font-semibold text-gomin-neutral-400 transition",
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

      <div className="mt-5 min-h-0 flex-1 overflow-x-auto">
        {activeView === "daily" && <DailyAreaChart />}
        {activeView === "hourly" && <HourlyBarChart />}
        {activeView === "peak" && <PeakHeatmapChart />}
      </div>
    </div>
  );
};

const DailyAreaChart = () => {
  return (
    <ChartContainer
      config={dailyChartConfig}
      className="aspect-auto h-[300px] min-w-[680px] [&_.recharts-cartesian-axis-tick_text]:fill-gomin-neutral-400"
      initialDimension={{ width: 760, height: 300 }}
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

const HourlyBarChart = () => {
  return (
    <ChartContainer
      config={hourlyChartConfig}
      className="aspect-auto h-[300px] min-w-[680px] [&_.recharts-cartesian-axis-tick_text]:fill-gomin-neutral-400"
      initialDimension={{ width: 760, height: 300 }}
    >
      <BarChart
        accessibilityLayer
        data={hourlyParticipantData}
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
          {hourlyParticipantData.map((item) => (
            <Cell key={item.hour} fill={item.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

const PeakHeatmapChart = () => {
  return (
    <div className="min-w-[700px]">
      <div className="relative">
        <ChartContainer
          config={peakChartConfig}
          className="aspect-auto h-[270px] [&_.recharts-cartesian-axis-tick_text]:fill-gomin-neutral-400"
          initialDimension={{ width: 760, height: 270 }}
        >
          <ScatterChart
            accessibilityLayer
            margin={{ top: 14, right: 8, bottom: 28, left: -12 }}
          >
            <XAxis
              type="number"
              dataKey="hour"
              domain={[-0.5, 23.5]}
              ticks={[0, 3, 6, 9, 12, 15, 18, 21]}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              interval={0}
              orientation="top"
            />
            <YAxis
              type="number"
              dataKey="dayIndex"
              domain={[-0.5, 6.5]}
              ticks={[0, 1, 2, 3, 4, 5, 6]}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              width={26}
              reversed
              tickFormatter={(value) => heatmapDays[Number(value)] ?? ""}
            />
            <ZAxis type="number" dataKey="count" range={[1, 1]} />
            <ChartTooltip cursor={false} content={<PeakTooltip />} />
            <Scatter
              data={peakParticipantData}
              shape={HeatmapCellShape as ScatterProps["shape"]}
            />
          </ScatterChart>
        </ChartContainer>

        {selectedPeakData && (
          <div
            className="pointer-events-none absolute top-[88px] rounded bg-[#4A4A4A] px-2.5 py-1.5 text-xs font-bold whitespace-nowrap text-white shadow-lg"
            style={{
              left: "calc(26px + ((100% - 34px) * 18.5 / 24))",
              transform: "translateX(-45%)",
            }}
          >
            {selectedPeakData.day} {selectedPeakData.hour}시 ·{" "}
            {selectedPeakData.count.toLocaleString("ko-KR")}명
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-gomin-neutral-400">
        <span>적음</span>
        <div className="flex gap-1">
          {heatmapColors.map((color) => (
            <span
              key={color}
              className="size-3 rounded-[3px]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>많음</span>
      </div>
    </div>
  );
};

const HeatmapCellShape = ({
  cx = 0,
  cy = 0,
  payload,
}: HeatmapCellShapeProps) => {
  const isSelected =
    payload?.day === selectedPeakCell.day &&
    payload.hour === selectedPeakCell.hour;

  return (
    <rect
      x={cx - 13.5}
      y={cy - 11}
      width={27}
      height={22}
      rx={3}
      fill={payload?.fill ?? heatmapColors[0]}
      stroke={isSelected ? "#4A35C8" : "transparent"}
      strokeWidth={isSelected ? 1.5 : 0}
    />
  );
};

const PeakTooltip = ({ active, payload }: PeakTooltipProps) => {
  if (!active || !payload?.[0]) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="rounded bg-[#4A4A4A] px-2.5 py-1.5 text-xs font-bold text-white shadow-lg">
      {item.day} {item.hour}시 · {item.count.toLocaleString("ko-KR")}명
    </div>
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

function getHeatmapColor(count: number) {
  const colorIndex = Math.min(
    heatmapColors.length - 1,
    Math.floor((count / 560) * heatmapColors.length)
  );

  return heatmapColors[colorIndex];
}

export default ParticipantAnalysisChart;
