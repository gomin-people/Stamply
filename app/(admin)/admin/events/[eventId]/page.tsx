"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import EventFormStepper from "@/components/admin/event/EventFormStepper";
import EventFormFooter from "@/components/admin/event/EventFormFooter";
import EventInfoForm from "@/components/admin/event/EventInfoForm";
import EventBrochureForm from "@/components/admin/event/EventBrochureForm";
import EventThemeStampForm from "@/components/admin/event/EventThemeStampForm";

const TOTAL_STEPS = 3;

const stepComponents = [EventInfoForm, EventBrochureForm, EventThemeStampForm];

export default function EventEditPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [currentStep, setCurrentStep] = useState(1);

  const StepForm = stepComponents[currentStep - 1];

  const handlePrev = () => setCurrentStep((s) => Math.max(1, s - 1));
  const handleNext = () => setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));

  return (
    <div className="p-8">
      <div className="rounded-xl border border-gomin-neutral-100 bg-white">
        <EventFormStepper currentStep={currentStep} />

        <div className="p-8">
          <StepForm />
        </div>

        <div className="px-8 pb-8">
          <EventFormFooter
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onPrev={handlePrev}
            onNext={handleNext}
            isLastStep={currentStep === TOTAL_STEPS}
            completeLabel="행사 수정 완료"
          />
        </div>
      </div>
    </div>
  );
}
