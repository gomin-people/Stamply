"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { getRankedBarColors } from "@/components/admin/dashboard/rankedBarColors";

type GenderData = {
  label: string;
  value: number;
  color: string;
};

type AgeData = {
  label: string;
  percent: number;
  color: string;
};

type AgeBarChartData = AgeData & {
  fill: string;
};

type Props = {
  totalRespondents: number;
  genderData: GenderData[];
  ageData: AgeData[];
};

const ageBarDarkColor = "#5435EB";
const ageBarLightColor = "#C8BEFA";

const genderChartConfig = {
  value: {
    label: "성별",
    color: "#5435EB",
  },
} satisfies ChartConfig;

const ageChartConfig = {
  percent: {
    label: "연령대",
    color: "#5435EB",
  },
} satisfies ChartConfig;

const ageYAxisWidth = 50;
const ageYAxisTickOffset = -36;

const ParticipantDemographicsChart = ({
  totalRespondents,
  genderData,
  ageData,
}: Props) => {
  return (
    <div className="flex h-full min-h-74 min-w-0 flex-col px-4 py-4">
      <div className="flex min-w-0 flex-wrap items-end gap-x-3 gap-y-1">
        <h2 className="text-lg font-semibold text-gomin-black">달성자 통계</h2>
        <p className="min-w-0 truncate text-sm font-medium text-gomin-neutral-400">
          달성자 성별 및 연령대 분포
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-8">
        <div className="col-span-1 min-w-0">
          <GenderDonutChart
            totalRespondents={totalRespondents}
            genderData={genderData}
          />
        </div>

        <div className="col-span-2 min-w-0">
          <AgeBarChart ageData={ageData} />
        </div>
      </div>
    </div>
  );
};

const GenderDonutChart = ({
  totalRespondents,
  genderData,
}: {
  totalRespondents: number;
  genderData: GenderData[];
}) => {
  return (
    <div className="min-w-0">
      <div className="relative mx-auto h-[190px] w-[min(220px,100%)]">
        <ChartContainer
          config={genderChartConfig}
          className="aspect-auto h-[190px] w-full min-w-0"
          initialDimension={{ width: 220, height: 190 }}
        >
          <PieChart accessibilityLayer>
            <ChartTooltip
              isAnimationActive={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => (
                    <span className="font-semibold">{Number(value)}%</span>
                  )}
                />
              }
            />
            <Pie
              data={genderData}
              dataKey="value"
              nameKey="label"
              innerRadius={54}
              outerRadius={86}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {genderData.map((item) => (
                <Cell key={item.label} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-1/2 left-0 w-full -translate-y-1/2 truncate px-2 text-center text-2xl text-gomin-black"
            title={`${totalRespondents.toLocaleString("ko-KR")}명`}
          >
            {totalRespondents.toLocaleString("ko-KR")}
          </div>
          <div className="absolute top-[calc(50%+1.25rem)] left-0 w-full truncate px-2 text-center text-xs text-gomin-black">
            (명)
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium text-gomin-neutral-600">
        {genderData.map((item) => (
          <div key={item.label} className="flex min-w-0 items-center gap-1.5">
            <span
              className="size-3 shrink-0 rounded-[3px]"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AgeBarChart = ({ ageData }: { ageData: AgeData[] }) => {
  const data = withAgeBarFill(ageData);
  const xAxisScale = getPercentChartScale(data);

  return (
    <ChartContainer
      config={ageChartConfig}
      className="aspect-auto h-[226px] min-w-0 [&_.recharts-cartesian-axis-tick_text]:fill-gomin-neutral-400"
      initialDimension={{ width: 520, height: 226 }}
    >
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ top: 6, right: 8, bottom: 4, left: 0 }}
      >
        <CartesianGrid horizontal={false} stroke="#ECECEC" />
        <XAxis
          type="number"
          domain={xAxisScale.domain}
          ticks={xAxisScale.ticks}
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          type="category"
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          width={ageYAxisWidth}
          tick={{ textAnchor: "start", dx: ageYAxisTickOffset }}
        />
        <ChartTooltip
          isAnimationActive={false}
          cursor={{ fill: "rgba(84, 53, 235, 0.06)" }}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value) => (
                <span className="font-semibold">{Number(value)}%</span>
              )}
            />
          }
        />
        <Bar dataKey="percent" radius={[0, 6, 6, 0]} barSize={22}>
          {data.map((item) => (
            <Cell key={item.label} fill={item.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

const withAgeBarFill = (ageData: AgeData[]): AgeBarChartData[] => {
  const colors = getRankedBarColors(ageData, (item) => item.percent, {
    darkColor: ageBarDarkColor,
    includeInScale: (value) => value > 0,
    lightColor: ageBarLightColor,
  });

  return ageData.map((item, index) => ({
    ...item,
    fill: colors[index],
  }));
};

const getPercentChartScale = (data: Array<{ percent: number }>) => {
  const maxPercent = data.reduce(
    (maxValue, item) => Math.max(maxValue, item.percent),
    0
  );
  const step = maxPercent > 50 ? 10 : 5;
  const domainMax = Math.min(
    100,
    Math.max(45, Math.ceil(maxPercent / step) * step)
  );
  const ticks = Array.from(
    { length: Math.floor(domainMax / step) + 1 },
    (_, index) => index * step
  );

  return {
    domain: [0, domainMax] as [number, number],
    ticks,
  };
};

export default ParticipantDemographicsChart;
