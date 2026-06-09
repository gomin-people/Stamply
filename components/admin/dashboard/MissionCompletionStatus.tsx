"use client";

import { motion } from "framer-motion";
import { cn, formatNumber } from "@/utils";

type MissionCompletionData = {
  id: number;
  title: string;
  completedCount: number;
  completionRate: number;
};

type Props = {
  missions: MissionCompletionData[];
};

const progressBarClassNames = {
  track: "bg-gomin-primary-200",
  fill: "bg-gomin-primary-700",
} as const;

const missionCompletionGridClassName =
  "grid grid-cols-[minmax(0,14rem)_minmax(0,4.25rem)_minmax(0,1fr)_minmax(4.5rem,5.75rem)]";

const MissionCompletionStatus = ({ missions }: Props) => {
  const missionItems = missions.slice(0, 10);

  return (
    <div className="flex h-full min-h-168 min-w-0 flex-col px-4 pt-4">
      <div className="flex min-w-0 flex-wrap items-end gap-x-3 gap-y-1">
        <h2 className="text-lg font-semibold text-gomin-black">
          미션별 완료 현황
        </h2>
        <p className="min-w-0 truncate text-sm font-medium text-gomin-neutral-400">
          미션 참여 및 완료 데이터
        </p>
      </div>

      <div
        className={cn(
          missionCompletionGridClassName,
          "mt-4 items-center gap-x-2 border-b border-gomin-neutral-100 pb-2 text-sm font-semibold text-gomin-neutral-400"
        )}
      >
        <span className="min-w-0 truncate">미션명</span>
        <span className="min-w-0 truncate text-right">완료자 수</span>
        <span className="col-start-4 min-w-0 truncate text-right">완료율</span>
      </div>

      {missionItems.length > 0 ? (
        <ul className="min-h-0 min-w-0">
          {missionItems.map((mission, index) => {
            const completedCountText = formatNumber(mission.completedCount);
            const completionRate = Math.min(
              Math.max(mission.completionRate, 0),
              100
            );

            return (
              <li
                key={mission.id}
                className={cn(
                  missionCompletionGridClassName,
                  "min-h-14.5 min-w-0 items-center gap-x-2 overflow-hidden border-b border-dashed border-gomin-neutral-100 last:border-b-0"
                )}
              >
                <span
                  className="block min-w-0 truncate text-sm text-gomin-black"
                  title={mission.title}
                >
                  {mission.title}
                </span>
                <span
                  className="flex min-w-0 justify-end text-sm text-gomin-neutral-600"
                  aria-label={`${completedCountText}명`}
                  title={`${completedCountText}명`}
                >
                  <span className="min-w-0 truncate">{completedCountText}</span>
                  <span className="shrink-0">명</span>
                </span>
                <div className="col-start-4 min-w-0">
                  <div className="text-right text-sm font-semibold text-gomin-black">
                    {mission.completionRate.toFixed(1)}%
                  </div>
                  <div
                    className={cn(
                      "mt-2 h-1.5 overflow-hidden rounded-full",
                      progressBarClassNames.track
                    )}
                    role="progressbar"
                    aria-label={`${mission.title} 완료율`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={completionRate}
                  >
                    <motion.div
                      className={cn(
                        "h-full origin-left rounded-full",
                        progressBarClassNames.fill
                      )}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: index * 0.04,
                        ease: "easeOut",
                      }}
                      style={{
                        width: `${completionRate}%`,
                      }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex min-h-72 flex-1 items-center justify-center rounded-xl border border-dashed border-gomin-neutral-100 text-sm font-medium text-gomin-neutral-400">
          등록된 미션 데이터가 없습니다.
        </div>
      )}
    </div>
  );
};

export default MissionCompletionStatus;
