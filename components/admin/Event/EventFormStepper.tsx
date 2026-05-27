import { cn } from '@/utils/index';

type Step = {
  number: number;
  label: string;
  sublabel: string;
};

const STEPS: Step[] = [
  { number: 1, label: 'STEP 01', sublabel: '행사정보 · 포스터' },
  { number: 2, label: 'STEP 02', sublabel: '브로슈어 업로드' },
  { number: 3, label: 'STEP 03', sublabel: '스탬프 · 테마색상' },
];

type Props = {
  currentStep: number;
};

export default function EventFormStepper({ currentStep }: Props) {
  return (
    <div className="relative flex h-[75px] w-full items-center border-b border-gomin-neutral-100">
      {STEPS.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div key={step.number} className="flex flex-1 items-center">
            <div
              className={cn(
                'flex items-center gap-3 rounded-full px-2 py-1.5',
              )}
            >
              <div
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium',
                  isActive || isCompleted
                    ? 'border-gomin-primary-700 bg-gomin-primary-700 text-white shadow-[0px_6px_14px_-4px_rgba(84,53,235,0.45)]'
                    : 'border-gomin-neutral-200 bg-white text-gomin-neutral-400',
                )}
              >
                {step.number}
              </div>
              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    'text-[10px] font-medium uppercase tracking-widest',
                    isActive || isCompleted
                      ? 'text-gomin-primary-700'
                      : 'text-gomin-neutral-400 opacity-70',
                  )}
                >
                  {step.label}
                </span>
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive || isCompleted
                      ? 'text-gomin-black'
                      : 'text-gomin-neutral-400',
                  )}
                >
                  {step.sublabel}
                </span>
              </div>
            </div>

            {index < STEPS.length - 1 && (
              <div className="mx-1 h-px flex-1 bg-gomin-neutral-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}
