"use client";

import { ScanLine } from "lucide-react";
import ThemedButton from "@/components/user/common/ThemedButton";

type FloatingActionButtonProps = {
  isAllCompleted?: boolean;
  onClick: () => void;
  label?: string;
  isPreview?: boolean;
  isRewardClaimed?: boolean;
};

export default function FloatingActionButton({
  isAllCompleted = false,
  onClick,
  label,
  isPreview = false,
  isRewardClaimed = false,
}: FloatingActionButtonProps) {
  return (
    <div
      className={`${isPreview ? "absolute" : "fixed"} bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50`}
    >
      <ThemedButton
        onClick={onClick}
        disabled={isRewardClaimed}
        className={`w-full max-w-none disabled:bg-gomin-neutral-200 disabled:text-gomin-neutral-400 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none`}
      >
        {label ? (
          <span>{label}</span>
        ) : isRewardClaimed ? (
          <span>리워드 수령 완료</span>
        ) : !isAllCompleted ? (
          <>
            <ScanLine className="w-5 h-5 stroke-[2.5]" />
            <span>QR 체크하기</span>
          </>
        ) : (
          <span>리워드 수령하기</span>
        )}
      </ThemedButton>
    </div>
  );
}
