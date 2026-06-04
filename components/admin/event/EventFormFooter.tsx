"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type Mode = "view" | "edit";

type EventFormFooterProps = {
  currentStep: number;
  totalSteps: number;
  onPrev?: () => void;
  onNext?: () => boolean | void;
  onComplete?: () => void;
  isLastStep?: boolean;
  completeLabel?: string;
  disabled?: boolean;
  mode?: Mode;
  onEditStart?: () => void;
  onEditCancel?: () => void;
  onEditSave?: () => void;
};

const outlineButton =
  "gap-1.5 rounded-xl border-gomin-neutral-200 px-5.5 py-3 text-sm font-medium text-gomin-black transition-transform hover:-translate-y-0.5 active:translate-y-0";

const primaryButton =
  "gap-1.5 rounded-xl bg-gomin-primary-700 bg-clip-border px-5.5 py-3 text-sm font-medium shadow-[0px_6px_16px_-6px_rgba(84,53,235,0.6)] transition-all hover:-translate-y-0.5 hover:bg-gomin-primary-700/90 hover:shadow-[0px_8px_20px_-6px_rgba(84,53,235,0.7)] active:translate-y-0";

const EventFormFooter = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onComplete,
  isLastStep = false,
  completeLabel = "행사 등록 완료",
  disabled = false,
  mode,
  onEditStart,
  onEditCancel,
  onEditSave,
}: EventFormFooterProps) => {
  const [shake, setShake] = useState(0);

  const handleNext = () => {
    if (isLastStep && !mode) {
      onComplete?.();
      return;
    }
    const result = onNext?.();
    if (result === false) setShake((s) => s + 1);
  };

  const showNextButton = !isLastStep || !mode;

  return (
    <div className="flex h-20 items-center gap-2 border-t border-gomin-neutral-100 pt-4">
      <div className="flex-1">
        {!mode && (
          <span className="text-xs font-medium">
            <span className="text-gomin-black">{currentStep}</span>
            <span className="text-gomin-neutral-400"> / {totalSteps} 단계</span>
          </span>
        )}
      </div>

      {mode === "view" && onEditStart && (
        <Button
          type="button"
          variant="outline"
          size={null}
          className={outlineButton}
          onClick={onEditStart}
        >
          수정하기
        </Button>
      )}

      {mode === "edit" && (
        <>
          <Button
            type="button"
            size={null}
            className={primaryButton}
            disabled={disabled}
            onClick={onEditSave}
          >
            <Save className="size-3.5" />
            변경사항 저장
          </Button>
          <Button
            type="button"
            variant="outline"
            size={null}
            className={outlineButton}
            onClick={onEditCancel}
          >
            <X className="size-3.5" />
            변경 취소
          </Button>
        </>
      )}

      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          size={null}
          className={outlineButton}
          onClick={onPrev}
        >
          <ChevronLeft className="size-3.5" />
          이전
        </Button>
      )}

      {showNextButton && (
        <motion.div
          key={shake}
          animate={shake > 0 ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <Button
            type="button"
            size={null}
            className={primaryButton}
            disabled={disabled}
            onClick={handleNext}
          >
            {!mode && isLastStep ? (
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
      )}
    </div>
  );
};

export default EventFormFooter;
