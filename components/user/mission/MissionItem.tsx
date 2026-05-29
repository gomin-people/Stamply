"use client";

import { useState } from "react";
import IconStamply from "@/components/icons/IconStamply";
import MissionDetailModal from "@/components/user/mission/MissionDetailModal";

type Mission = {
  id: number;
  title: string;
  description: string;
  isStamped: boolean;
};

interface MissionItemProps {
  mission: Mission;
  stampImageUrl?: string | null;
}

export default function MissionItem({
  mission,
  stampImageUrl,
}: MissionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-6 p-4 rounded-[20px] cursor-pointer w-full select-none transition-all duration-300 hover:shadow-md active:scale-[0.99] shadow-sm border border-transparent ${
          mission.isStamped ? "bg-gomin-primary-100" : "bg-gomin-neutral-100"
        }`}
      >
        {/* 스탬프 도장 이미지 영역 (왼쪽) - 둥근 원 테두리를 제거하고 순수 이미지 노출 */}
        <div className="w-26 h-26 shrink-0 relative flex items-center justify-center select-none">
          {stampImageUrl ? (
            <img
              src={stampImageUrl}
              alt="Stamp"
              className={`w-full h-full object-contain ${
                mission.isStamped ? "opacity-100" : "opacity-30 grayscale"
              }`}
            />
          ) : (
            <IconStamply
              className={`w-full h-full ${
                mission.isStamped
                  ? "text-gomin-primary-700 opacity-100"
                  : "text-gomin-neutral-400 opacity-30"
              }`}
            />
          )}
        </div>

        {/* 텍스트 정보 영역 (오른쪽) */}
        <div className="flex flex-col text-left space-y-2 flex-1">
          <span
            className={`text-[25px] font-sans font-black tracking-tight leading-none ${
              mission.isStamped
                ? "text-gomin-primary-700"
                : "text-gomin-neutral-600"
            }`}
          >
            {mission.title}
          </span>
          <div
            className={`flex flex-col text-[16px] font-sans font-bold leading-tight tracking-tight whitespace-pre-line ${
              mission.isStamped
                ? "text-gomin-neutral-600"
                : "text-gomin-neutral-500"
            }`}
          >
            {mission.description}
          </div>
        </div>
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
