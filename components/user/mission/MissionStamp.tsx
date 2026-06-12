"use client";

import { useState } from "react";
import Image from "next/image";
import IconStamplo from "@/components/icons/IconStamplo";
import MissionDetailModal from "@/components/user/mission/MissionDetailModal";
import { cn } from "@/utils";

type Mission = {
  id: number;
  title: string;
  description: string;
  isStamped: boolean;
};

type MissionStampProps = {
  mission: Mission;
  stampImageUrl?: string | null;
};

const MissionStamp = ({ mission, stampImageUrl }: MissionStampProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={cn(
          "relative aspect-square flex flex-col items-center justify-center p-5 rounded-3xl cursor-pointer shadow-md select-none hover:shadow-lg active:scale-[0.97] overflow-hidden transition-colors",
          mission.isStamped
            ? "bg-gomin-primary-100 border border-gomin-primary-200/50 animate-stamp-card-pop"
            : "bg-gomin-neutral-100 border border-transparent"
        )}
      >
        <div className="flex flex-col items-center justify-center text-center z-10 w-full px-1">
          <span
            className={cn(
              "w-full text-2xl font-sans font-black break-keep line-clamp-none",
              mission.isStamped
                ? "text-gomin-neutral-800/80"
                : "text-gomin-neutral-600"
            )}
          >
            {mission.title}
          </span>
        </div>

        {mission.isStamped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 select-none -rotate-12 scale-[0.95] text-gomin-primary-700 animate-stamp-press">
            {stampImageUrl ? (
              <div className="relative w-[81%] h-[85%]">
                <Image
                  src={stampImageUrl}
                  alt="Stamp"
                  fill
                  sizes="160px"
                  fetchPriority="high"
                  loading="eager"
                  className="object-contain opacity-95"
                />
              </div>
            ) : (
              <IconStamplo className="w-[81%] h-[85%] aspect-162/171 opacity-95" />
            )}
          </div>
        )}
      </div>

      <MissionDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mission={mission}
      />
    </>
  );
};

export default MissionStamp;
