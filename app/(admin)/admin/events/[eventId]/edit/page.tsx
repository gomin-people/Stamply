'use client';

import { useState } from 'react';
import { use } from 'react';
import EventFormStepper from '@/components/admin/event/EventFormStepper';
import EventFormFooter from '@/components/admin/event/EventFormFooter';
import EventStep1Form from '@/components/admin/event/EventStep1Form';
import EventStep2Form from '@/components/admin/event/EventStep2Form';
import EventStep3Form from '@/components/admin/event/EventStep3Form';

const TOTAL_STEPS = 3;

const stepComponents = [EventStep1Form, EventStep2Form, EventStep3Form];

type Props = {
  params: Promise<{ eventId: string }>;
};

export default function EventEditPage({ params }: Props) {
  const { eventId } = use(params);
  const [currentStep, setCurrentStep] = useState(1);

  const StepForm = stepComponents[currentStep - 1];

  const handlePrev = () => setCurrentStep((s) => Math.max(1, s - 1));
  const handleNext = () => setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gomin-black">행사 수정</h1>
        <p className="mt-1 text-sm text-gomin-neutral-400">
          행사 정보를 수정합니다. (ID: {eventId})
        </p>
      </div>

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
