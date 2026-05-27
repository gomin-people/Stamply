import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  currentStep: number;
  totalSteps: number;
  onPrev?: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
};

export default function EventFormFooter({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  isLastStep = false,
}: Props) {
  return (
    <div className="flex items-center gap-2.5 border-t border-gomin-neutral-100 pt-6">
      <span className="flex-1 text-xs font-medium">
        <span className="text-gomin-black">{currentStep}</span>
        <span className="text-gomin-neutral-400"> / {totalSteps} 단계</span>
      </span>

      <Button
        variant="outline"
        className="rounded-xl px-6 py-3"
        disabled={currentStep === 1}
        onClick={onPrev}
      >
        <ChevronLeft className="size-3.5" />
        이전
      </Button>

      <Button
        className="rounded-xl bg-gomin-primary-700 px-6 py-3 shadow-[0px_6px_16px_-6px_rgba(84,53,235,0.6)] hover:bg-gomin-primary-700/90"
        onClick={onNext}
      >
        {isLastStep ? '완료' : '다음'}
        {!isLastStep && <ChevronRight className="size-3.5" />}
      </Button>
    </div>
  );
}
