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

type Props = {
  totalAchievers: number;
  genderData: GenderData[];
  ageData: AgeData[];
};

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

const ParticipantDemographicsChart = ({
  totalAchievers,
  genderData,
  ageData,
}: Props) => {
  return (
    <div className="flex h-full min-h-74 flex-col px-4 py-4">
      <div className="flex flex-row items-end gap-3">
        <h2 className="text-lg font-semibold text-gomin-black">달성자 통계</h2>
        <p className="text-sm font-medium text-gomin-neutral-400">
          달성자 성별 및 연령대 분포
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-8">
        <div className="col-span-1 min-w-0">
          <GenderDonutChart
            totalAchievers={totalAchievers}
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
  totalAchievers,
  genderData,
}: {
  totalAchievers: number;
  genderData: GenderData[];
}) => {
  return (
    <div className="w-full">
      <div className="relative mx-auto h-[190px] w-[220px]">
        <ChartContainer
          config={genderChartConfig}
          className="aspect-auto h-[190px] w-[220px]"
          initialDimension={{ width: 220, height: 190 }}
        >
          <PieChart accessibilityLayer>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <span className="font-semibold">
                      {name} {Number(value)}%
                    </span>
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

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gomin-black">
              {totalAchievers.toLocaleString("ko-KR")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs font-medium text-gomin-neutral-600">
        {genderData.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="size-3 rounded-[3px]"
              style={{ backgroundColor: item.color }}
            />
            <span>
              {item.label} {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AgeBarChart = ({ ageData }: { ageData: AgeData[] }) => {
  return (
    <ChartContainer
      config={ageChartConfig}
      className="aspect-auto h-[226px] [&_.recharts-cartesian-axis-tick_text]:fill-gomin-neutral-400"
      initialDimension={{ width: 520, height: 226 }}
    >
      <BarChart
        accessibilityLayer
        data={ageData}
        layout="vertical"
        margin={{ top: 6, right: 8, bottom: 4, left: 0 }}
      >
        <CartesianGrid horizontal={false} stroke="#ECECEC" />
        <XAxis
          type="number"
          domain={[0, 45]}
          ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45]}
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
          width={42}
        />
        <ChartTooltip
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
          {ageData.map((item) => (
            <Cell key={item.label} fill={item.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default ParticipantDemographicsChart;
