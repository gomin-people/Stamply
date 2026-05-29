"use client";

import { useRef, useState } from "react";
import EventFormStepper from "@/components/admin/event/EventFormStepper";
import EventFormFooter from "@/components/admin/event/EventFormFooter";
import EventInfoForm from "@/components/admin/event/EventInfoForm";
import EventStep2Form from "@/components/admin/event/EventStep2Form";
import EventStep3Form from "@/components/admin/event/EventStep3Form";
import { type StepFormHandle } from "@/types";

const TOTAL_STEPS = 3;

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const step1Ref = useRef<StepFormHandle>(null);
  const step2Ref = useRef<StepFormHandle>(null);
  const step3Ref = useRef<StepFormHandle>(null);

  const stepRefs = [step1Ref, step2Ref, step3Ref];

  const handlePrev = () => setCurrentStep((s) => Math.max(1, s - 1));

  const handleNext = () => {
    const ref = stepRefs[currentStep - 1];
    console.log("제출 데이터:", ref.current?.getData());

    if (!ref.current?.validate()) return;
    setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const handleComplete = () => {
    const ref = stepRefs[currentStep - 1];
    if (!ref.current?.validate()) return;
    const allData = stepRefs.map((r) => r.current?.getData());
    console.log("제출 데이터:", allData);
    // TODO: submit API 호출
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
            <EventStep2Form ref={step2Ref} />
          </div>
          <div className={currentStep !== 3 ? "hidden" : ""}>
            <EventStep3Form ref={step3Ref} />
          </div>
        </div>

        <div className="px-6 pb-4">
          <EventFormFooter
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onPrev={handlePrev}
            onNext={currentStep === TOTAL_STEPS ? handleComplete : handleNext}
            isLastStep={currentStep === TOTAL_STEPS}
            completeLabel="행사 등록 완료"
          />
        </div>
      </div>
    </div>
  );
}
