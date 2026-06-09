"use client";

import { useState } from "react";
import Image from "next/image";
import IconStamply from "@/components/icons/IconStamply";
import MissionDetailModal from "@/components/user/mission/MissionDetailModal";
import { cn } from "@/utils";

type Mission = {
  id: number;
  title: string;
  description: string;
  isStamped: boolean;
};

type MissionItemProps = {
  mission: Mission;
  stampImageUrl?: string | null;
};

const MissionItem = ({ mission, stampImageUrl }: MissionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-6 p-4 rounded-[20px] cursor-pointer w-full select-none transition-all duration-300 hover:shadow-md active:scale-[0.99] shadow-sm border border-transparent",
          mission.isStamped ? "bg-gomin-primary-100" : "bg-gomin-neutral-100"
        )}
      >
        {/* 스탬프 도장 이미지 영역 (왼쪽) */}
        <div className="w-26 h-26 shrink-0 relative flex items-center justify-center select-none">
          {stampImageUrl ? (
            <Image
              src={stampImageUrl}
              alt="Stamp"
              fill
              className={cn(
                "object-contain",
                mission.isStamped ? "opacity-100" : "opacity-30 grayscale"
              )}
            />
          ) : (
            <IconStamply
              className={cn(
                "w-full h-full",
                mission.isStamped
                  ? "text-gomin-primary-700 opacity-100"
                  : "text-gomin-neutral-400 opacity-30"
              )}
            />
          )}
        </div>

        {/* 텍스트 정보 영역 (오른쪽) */}
        <div className="flex flex-col text-left space-y-2 flex-1 min-w-0">
          <span
            className={cn(
              "text-[24px] font-sans font-black tracking-tight leading-tight break-keep line-clamp-2",
              mission.isStamped
                ? "text-gomin-primary-700"
                : "text-gomin-neutral-600"
            )}
          >
            {mission.title}
          </span>
          <div
            className={cn(
              "text-[16px] font-sans font-bold leading-tight tracking-tight break-keep line-clamp-2",
              mission.isStamped
                ? "text-gomin-neutral-600"
                : "text-gomin-neutral-500"
            )}
          >
            {mission.description}
          </div>
        </div>
      </div>

      <MissionDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mission={mission}
      />
    </>
  );
};

export default MissionItem;
