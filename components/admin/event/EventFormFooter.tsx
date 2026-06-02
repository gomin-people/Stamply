"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type Props = {
  currentStep: number;
  totalSteps: number;
  onPrev?: () => void;
  onNext?: () => boolean | void;
  onComplete?: () => void;
  isLastStep?: boolean;
  completeLabel?: string;
  disabled?: boolean;
};

export default function EventFormFooter({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onComplete,
  isLastStep = false,
  completeLabel = "행사 등록 완료",
  disabled = false,
}: Props) {
  const [shake, setShake] = useState(0);

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
      return;
    }
    const result = onNext?.();
    if (result === false) {
      setShake((s) => s + 1);
    }
  };

  return (
    <div className="flex h-20 items-center gap-2 border-t border-gomin-neutral-100 pt-4">
      <span className="flex-1 text-xs font-medium">
        <span className="text-gomin-black">{currentStep}</span>
        <span className="text-gomin-neutral-400"> / {totalSteps} 단계</span>
      </span>

      <Button
        type="button"
        variant="outline"
        className="h-auto! gap-1.5 rounded-xl border-gomin-neutral-200 px-5.5 py-3 text-sm font-medium text-gomin-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
        style={{ visibility: currentStep === 1 ? "hidden" : "visible" }}
        onClick={onPrev}
      >
        <ChevronLeft className="size-3.5" />
        이전
      </Button>

      <motion.div
        key={shake}
        animate={shake > 0 ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Button
          type="button"
          size={null}
          className="gap-1.5 rounded-xl bg-gomin-primary-700 bg-clip-border px-5.5 py-3 text-sm font-medium shadow-[0px_6px_16px_-6px_rgba(84,53,235,0.6)] transition-all hover:-translate-y-0.5 hover:bg-gomin-primary-700/90 hover:shadow-[0px_8px_20px_-6px_rgba(84,53,235,0.7)] active:translate-y-0"
          disabled={disabled}
          onClick={handleNext}
        >
          {isLastStep ? (
            <>
              {completeLabel}
              <Check className="size-3.5" />
            </>
          ) : (
            <>
              다음
              <ChevronRight className="size-3.5" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
