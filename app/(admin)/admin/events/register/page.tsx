"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import EventFormStepper from "@/components/admin/event/EventFormStepper";
import StepNavButtons from "@/components/admin/event/StepNavButtons";
import EventInfoForm from "@/components/admin/event/EventInfoForm";
import EventBrochureForm from "@/components/admin/event/EventBrochureForm";
import EventThemeStampForm from "@/components/admin/event/EventThemeStampForm";
import { type StepFormHandle } from "@/types";
import { useCreateEventMutation } from "@/features/admin/events/adminEventMutations";
import type { EventCreatePayloadModel } from "@/types/models";

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
    } as EventCreatePayloadModel;

    try {
      const event = await createEvent(payload);
      toast.success("행사 생성이 완료되었습니다!");
      router.push(`/admin/events/${event.id}`);
    } catch {
      toast.error("행사 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-10 py-7">
      <div className="rounded-xl border border-gomin-neutral-100 bg-white">
        <div className="flex flex-col">
          <EventFormStepper currentStep={currentStep} />
          <hr className="border-gomin-neutral-100" />
          <div className="flex justify-end px-8 pt-4">
            <StepNavButtons
              currentStep={currentStep}
              isLastStep={currentStep === TOTAL_STEPS}
              disabled={isPending}
              onPrev={handlePrev}
              onNext={handleNext}
              onComplete={handleComplete}
              completeTooltip="행사 등록 하기!"
            />
          </div>
        </div>

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
      </div>
    </div>
  );
}
