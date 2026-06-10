"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/index";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  currentStep: number;
  isLastStep?: boolean;
  disabled?: boolean;
  onPrev?: () => void;
  onNext?: () => boolean | void;
  onComplete?: () => void;
  completeTooltip?: string;
};

const StepNavButtons = ({
  currentStep,
  isLastStep = false,
  disabled = false,
  onPrev,
  onNext,
  onComplete,
  completeTooltip = "완료",
}: Props) => {
  const [shake, setShake] = useState(0);

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
      return;
    }
    const result = onNext?.();
    if (result === false) setShake((s) => s + 1);
  };

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size={null}
        className={cn(
          "size-11 rounded-full border-gomin-neutral-100 p-0 transition-all hover:-translate-y-0.5 active:translate-y-0",
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
                className={cn(
                  "size-11 rounded-full bg-gomin-primary-700 bg-clip-border p-0 shadow-[0px_5px_14px_-5px_rgba(84,53,235,0.55)] transition-all hover:-translate-y-0.5 hover:bg-gomin-primary-700/90 active:translate-y-0",
                  !isLastStep &&
                    !onNext &&
                    "pointer-events-none bg-gomin-primary-300! shadow-none!"
                )}
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
            <TooltipContent side="left">{completeTooltip}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StepNavButtons;
