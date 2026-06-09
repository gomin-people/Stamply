"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/index";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Step = {
  number: number;
  label: string;
  sublabel: string;
};

const STEPS: Step[] = [
  { number: 1, label: "STEP 01", sublabel: "행사정보 · 포스터" },
  { number: 2, label: "STEP 02", sublabel: "브로슈어 업로드" },
  { number: 3, label: "STEP 03", sublabel: "스탬프 · 테마색상" },
];

type Props = {
  currentStep: number;
  totalSteps: number;
  onPrev?: () => void;
  onNext?: () => boolean | void;
  onComplete?: () => void;
  isLastStep?: boolean;
  disabled?: boolean;
};

export default function EventFormStepper({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onComplete,
  isLastStep = false,
  disabled = false,
}: Props) {
  const [shake, setShake] = useState(0);

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
      return;
    }
    const result = onNext?.();
    if (result === false) setShake((s) => s + 1);
  };

  const stepItems: React.ReactNode[] = [];

  STEPS.forEach((step, index) => {
    const isActive = step.number === currentStep;
    const isCompleted = step.number < currentStep;

    if (index > 0) {
      stepItems.push(
        <div
          key={`divider-${index}`}
          className="h-px flex-1 bg-gomin-neutral-200 mt-2.5"
        />
      );
    }

    stepItems.push(
      <div
        key={step.number}
        className="flex shrink-0 items-center gap-3 rounded-full px-2 py-1.5"
      >
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium mt-2",
            isCompleted
              ? "border-gomin-primary-100 bg-gomin-primary-100 text-gomin-primary-700"
              : isActive
                ? "border-gomin-primary-700 bg-gomin-primary-700 text-white shadow-[0px_6px_14px_-4px_rgba(84,53,235,0.45)]"
                : "border-gomin-neutral-200 bg-white text-gomin-neutral-400"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isCompleted ? (
              <motion.span
                key="check"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Check className="size-3.5" />
              </motion.span>
            ) : (
              <motion.span
                key={step.number}
                className="flex items-center justify-center"
                style={{ lineHeight: 1 }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.08 }}
              >
                {step.number}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-widest",
              isActive || isCompleted
                ? "text-gomin-primary-700"
                : "text-gomin-neutral-400 opacity-70"
            )}
          >
            {step.label}
          </span>
          <span
            className={cn(
              "text-sm font-semibold",
              isActive || isCompleted
                ? "text-gomin-black"
                : "text-gomin-neutral-400"
            )}
          >
            {step.sublabel}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col">
      {/* 스테퍼 */}
      <div className="flex h-24 w-full items-center px-8">{stepItems}</div>

      <hr className="border-gomin-neutral-100" />

      {/* 이전/다음 버튼 */}
      <div className="flex justify-end gap-2 px-8 py-4">
        <Button
          type="button"
          variant="outline"
          size={null}
          className={cn(
            "size-11 rounded-full border-gomin-neutral-200 p-0 transition-all hover:-translate-y-0.5 active:translate-y-0",
            currentStep === 1 && "pointer-events-none opacity-40"
          )}
          onClick={onPrev}
          tabIndex={currentStep === 1 ? -1 : 0}
        >
          <ChevronLeft className="size-4.5" />
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                key={shake}
                animate={shake > 0 ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Button
                  type="button"
                  size={null}
                  className="size-11 rounded-full bg-gomin-primary-700 p-0 shadow-[0px_5px_14px_-5px_rgba(84,53,235,0.55)] transition-all hover:-translate-y-0.5 hover:bg-gomin-primary-700/90 active:translate-y-0"
                  disabled={disabled}
                  onClick={handleNext}
                >
                  {isLastStep ? (
                    <Check className="size-4.5" />
                  ) : (
                    <ChevronRight className="size-4.5" />
                  )}
                </Button>
              </motion.div>
            </TooltipTrigger>
            {isLastStep && (
              <TooltipContent side="left">행사 등록 하기!</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
