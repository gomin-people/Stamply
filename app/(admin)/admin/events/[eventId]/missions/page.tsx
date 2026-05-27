'use client';

import { useMemo, useState } from 'react';
import MissionFilter from '@/components/admin/mission/MissionFilter';
import QRDownloadButton from '@/components/admin/mission/QRDownloadButton';
import MissionAddButton from '@/components/admin/mission/MissionAddButton';
import MissionList from '@/components/admin/mission/MissionList';
import { useAdminMissionsQuery } from '@/features/admin/missions/adminMissionQueries';
import { useParams } from 'next/navigation';
import MissionListSkeleton from '@/components/admin/mission/MissionListSkeleton';
import { Button } from '@/components/ui/button';

export default function MissionPage() {
  const [filter, setFilter] = useState('all');
  const eventId = Number(useParams().eventId);
  const {
    data: missions,
    isLoading,
    isError,
    refetch,
  } = useAdminMissionsQuery(eventId);
  const filteredMissions = useMemo(() => {
    if (!missions) return [];
    return missions.filter((mission) => {
      if (filter === 'all') return true;
      if (filter === 'active') return mission.isActive;
      if (filter === 'inactive') return !mission.isActive;
      return true;
    });
  }, [missions, filter]);

  const totalCount = missions?.length ?? 0;
  const handleToggle = (value: string) => {
    setFilter(value);
  };

  return (
    <div className="p-8">
      <div className="bg-white border rounded-xl border-gomin-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gomin-neutral-100">
          <MissionFilter toggleValue={handleToggle} />
          <div className="flex items-center gap-2">
            <MissionAddButton disabled={totalCount >= 10} />
            <QRDownloadButton missions={filteredMissions} />
          </div>
        </div>

        <div
          className="grid items-center px-6 py-3 text-sm font-medium border-b bg-gomin-primary-100 text-gomin-primary-700 border-gomin-neutral-100"
          style={{ gridTemplateColumns: '40px 60px 1fr 2fr 110px 72px 90px' }}
        >
          <div />
          <div>#</div>
          <div>미션명</div>
          <div>설명</div>
          <div className="text-center">활성화</div>
          <div className="text-center">QR</div>
          <div className="text-center">관리</div>
        </div>

        {isLoading ? (
          <MissionListSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gomin-neutral-400">
            <p className="text-sm">데이터를 불러오지 못했습니다.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              다시 시도
            </Button>
          </div>
        ) : (
          <MissionList missions={filteredMissions ?? []} />
        )}
      </div>
    </div>
  );
}
