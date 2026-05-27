'use client';

import { useState } from 'react';
import IconStamply from '@/components/icons/IconStamply';
import MissionDetailModal from '@/components/user/MissionDetailModal';

type Mission = {
  id: number;
  title: string;
  description: string;
  isStamped: boolean;
  token?: string | null;
};

interface MissionStampProps {
  mission: Mission;
}

export default function MissionStamp({ mission }: MissionStampProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`relative aspect-square flex flex-col items-center justify-center p-5 rounded-3xl cursor-pointer shadow-md select-none transition-all duration-300 hover:shadow-lg active:scale-[0.97] overflow-hidden ${
          mission.isStamped
            ? 'bg-gomin-primary-100 border border-gomin-primary-200/50'
            : 'bg-gomin-neutral-100 border border-transparent'
        }`}
      >
        {/* 미션 텍스트 (도장이 찍혔을 경우 도장 아래에 겹쳐서 보임) */}
        <div
          className={`flex flex-col items-center justify-center text-center space-y-2 z-10 ${
            mission.isStamped
              ? 'text-gomin-primary-700/60'
              : 'text-gomin-neutral-500'
          }`}
        >
          <span
            className={`text-2xl font-sans font-black ${
              mission.isStamped
                ? 'text-gomin-neutral-800/80'
                : 'text-gomin-neutral-600'
            }`}
          >
            {mission.title}
          </span>
          <p
            className={`text-[14px] font-sans max-w-[120px] leading-tight font-bold ${
              mission.isStamped
                ? 'text-gomin-neutral-500/70'
                : 'text-gomin-neutral-400'
            }`}
          >
            {mission.description}
          </p>
        </div>

        {/* 완료 상태일 때 보라색 도장 오버레이 */}
        {mission.isStamped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 select-none transform  scale-[0.95] text-gomin-primary-700">
            <IconStamply className="w-[81%] h-[85%] aspect-[162/171] opacity-95 animate-fade-in" />
          </div>
        )}
      </div>

      {/* 분리된 미션 상세 모달 컴포넌트 */}
      <MissionDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mission={mission}
      />
    </>
  );
}
