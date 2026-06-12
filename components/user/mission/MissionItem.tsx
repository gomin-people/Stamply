"use client";

import { useState } from "react";
import Image from "next/image";
import IconStamplo from "@/components/icons/IconStamplo";
import IconDashedCircle from "@/components/icons/IconDashedCircle";
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
          "flex items-center gap-6 p-4 rounded-[20px] cursor-pointer w-full select-none hover:shadow-md active:scale-[0.99] shadow-sm border border-transparent transition-colors",
          mission.isStamped
            ? "bg-gomin-primary-100 animate-stamp-color"
            : "bg-gomin-neutral-100 "
        )}
      >
        <div className="w-26 h-26 shrink-0 relative flex items-center justify-center select-none">
          {!mission.isStamped ? (
            <IconDashedCircle className="w-full h-full text-gomin-neutral-300" />
          ) : stampImageUrl ? (
            <Image
              src={stampImageUrl}
              alt="Stamp"
              fill
              className="object-contain animate-stamp-press"
            />
          ) : (
            <IconStamplo className="w-full h-full text-gomin-primary-700 animate-stamp-press" />
          )}
        </div>

        <div className="flex flex-col text-left space-y-2 flex-1 min-w-0">
          <span
            className={cn(
              "text-[24px] font-sans font-black tracking-tight leading-tight break-keep line-clamp-2 transition-colors",
              mission.isStamped
                ? "text-gomin-primary-700 animate-stamp-color"
                : "text-gomin-neutral-600 "
            )}
          >
            {mission.title}
          </span>
          <div
            className={cn(
              "text-[16px] font-sans font-bold leading-tight tracking-tight break-keep line-clamp-2 transition-colors",
              mission.isStamped
                ? "text-gomin-neutral-600 animate-stamp-color"
                : "text-gomin-neutral-500 "
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
