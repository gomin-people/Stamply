"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import EventFormStepper from "@/components/admin/event/EventFormStepper";
import EventFormFooter from "@/components/admin/event/EventFormFooter";
import EventInfoForm from "@/components/admin/event/EventInfoForm";
import EventBrochureForm from "@/components/admin/event/EventBrochureForm";
import EventThemeStampForm from "@/components/admin/event/EventThemeStampForm";
import { type StepFormHandle } from "@/types";
import { useCreateEventMutation } from "@/features/admin/events/adminEventMutations";
import type { EventCreatePayload } from "@/features/shared/types/stamply";
import { toast } from "sonner";

const TOTAL_STEPS = 3;

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { mutateAsync: createEvent, isPending } = useCreateEventMutation();

  const step1Ref = useRef<StepFormHandle>(null);
  const step2Ref = useRef<StepFormHandle>(null);
  const step3Ref = useRef<StepFormHandle>(null);

  const stepRefs = [step1Ref, step2Ref, step3Ref];

  const handlePrev = () => setCurrentStep((s) => Math.max(1, s - 1));

  // 유효성 검사 통과 못할 시 버튼 흔들리는 애니메이션을 위해 false값을 넘겨줘야해서 false 다시 넣음.
  const handleNext = () => {
    const ref = stepRefs[currentStep - 1];
    if (!ref.current?.validate()) return false;
    setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const handleComplete = async () => {
    const ref = stepRefs[currentStep - 1];
    if (!ref.current?.validate()) return;

    const [step1Data, step2Data, step3Data] = stepRefs.map((r) =>
      r.current?.getData()
    );
    const payload = {
      ...step1Data,
      ...step2Data,
      ...step3Data,
    } as EventCreatePayload;

    try {
      const event = await createEvent(payload);
      toast.success("행사 생성이 완료되었습니다!");
      router.push(`/admin/events/${event.id}`);
    } catch {
      toast.error("행사 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-10 py-8">
      <div className="rounded-xl border border-gomin-neutral-100 bg-white">
        <EventFormStepper currentStep={currentStep} />

        <div className="p-6">
          <div className={currentStep !== 1 ? "hidden" : ""}>
            <EventInfoForm ref={step1Ref} />
          </div>
          <div className={currentStep !== 2 ? "hidden" : ""}>
            <EventBrochureForm ref={step2Ref} />
          </div>
          <div className={currentStep !== 3 ? "hidden" : ""}>
            <EventThemeStampForm ref={step3Ref} />
          </div>
        </div>

        <div className="px-6 pb-4">
          <EventFormFooter
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onPrev={handlePrev}
            onNext={handleNext}
            onComplete={handleComplete}
            isLastStep={currentStep === TOTAL_STEPS}
            completeLabel={isPending ? "행사 생성 중..." : "행사 등록 완료"}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  );
}
