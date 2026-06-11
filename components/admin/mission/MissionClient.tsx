"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { adminMissionQueryOptions } from "@/features/admin/missions/adminMissionQueries";
import { useAdminEventQuery } from "@/features/admin/events/adminEventQueries";
import MissionFilter from "@/components/admin/mission/MissionFilter";
import MissionAddButton from "@/components/admin/mission/MissionAddButton";
import { Info } from "lucide-react";
import MissionList from "@/components/admin/mission/MissionList";
import { Button } from "@/components/ui/button";
import type { AdminMissionDetail } from "@/types/models";
import { getEventOperationStatus } from "@/utils/event-status";

const QRDownloadButton = dynamic(
  () => import("@/components/admin/mission/QRDownloadButton"),
  { ssr: false }
);

type Props = {
  eventId: number;
};

export default function MissionClient({ eventId }: Props) {
  const [filter, setFilter] = useState("all");

  const {
    data: missions,
    isError,
    refetch,
  } = useQuery(adminMissionQueryOptions.list(eventId));

  const { data: event } = useAdminEventQuery(eventId);

  const filteredMissions = useMemo(() => {
    if (!missions) return [];
    return missions.filter((mission: AdminMissionDetail) => {
      if (filter === "all") return true;
      if (filter === "active") return mission.isActive;
      if (filter === "inactive") return !mission.isActive;
      return true;
    });
  }, [missions, filter]);

  const isMissionCountOver = (missions?.length ?? 0) >= 10;
  const isAfter =
    !!event && getEventOperationStatus(event.startDate, event.endDate).isAfter;

  const handleToggle = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="p-8">
      <div className="bg-white border rounded-xl border-gomin-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gomin-neutral-100">
          <div className="flex items-center gap-3">
            <MissionFilter toggleValue={handleToggle} />
            {filter !== "all" && (
              <span className="flex items-center gap-1 text-xs text-gomin-neutral-400">
                <Info className="w-3.5 h-3.5 shrink-0" />
                필터 적용 중에는 순서 변경이 불가합니다.
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <MissionAddButton disabled={isMissionCountOver || isAfter} />
            <QRDownloadButton missions={filteredMissions} disabled={isAfter} />
          </div>
        </div>

        <div
          className="grid items-center px-6 py-3 text-sm font-medium border-b bg-gomin-primary-100 text-gomin-primary-700 border-gomin-neutral-100"
          style={{ gridTemplateColumns: "40px 60px 1fr 2fr 110px 72px 90px" }}
        >
          <div />
          <div>순서</div>
          <div>미션명</div>
          <div>설명</div>
          <div className="text-center">활성화</div>
          <div className="text-center">QR</div>
          <div className="text-center">관리</div>
        </div>

        {isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gomin-neutral-400">
            <p className="text-sm">데이터를 불러오지 못했습니다.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              다시 시도
            </Button>
          </div>
        ) : (
          <MissionList
            missions={filteredMissions ?? []}
            disabled={isAfter}
            filter={filter}
          />
        )}
      </div>
    </div>
  );
}
