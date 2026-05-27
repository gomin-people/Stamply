'use client';

import { useState } from 'react';
import EventFormStepper from '@/components/admin/event/EventFormStepper';
import EventFormFooter from '@/components/admin/event/EventFormFooter';
import EventInfoForm from '@/components/admin/event/EventInfoForm';
import EventStep2Form from '@/components/admin/event/EventStep2Form';
import EventStep3Form from '@/components/admin/event/EventStep3Form';

const TOTAL_STEPS = 3;

const stepComponents = [EventInfoForm, EventStep2Form, EventStep3Form];

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const StepForm = stepComponents[currentStep - 1];

  const handlePrev = () => setCurrentStep((s) => Math.max(1, s - 1));
  const handleNext = () => setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));

  return (
    <div className="p-8">
      <div className="rounded-xl border border-gomin-neutral-100 bg-white">
        <EventFormStepper currentStep={currentStep} />

        <div className="p-6">
          <StepForm />
        </div>

        <div className="px-6 pb-4">
          <EventFormFooter
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onPrev={handlePrev}
            onNext={handleNext}
            isLastStep={currentStep === TOTAL_STEPS}
            completeLabel="행사 등록 완료"
          />
        </div>
      </div>
    </div>
  );
}
