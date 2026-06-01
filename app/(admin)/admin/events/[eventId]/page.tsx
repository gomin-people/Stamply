"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import EventFormStepper from "@/components/admin/event/EventFormStepper";
import EventFormFooter from "@/components/admin/event/EventFormFooter";
import EventInfoForm from "@/components/admin/event/EventInfoForm";
import EventBrochureForm from "@/components/admin/event/EventBrochureForm";
import EventStep3Form from "@/components/admin/event/EventStep3Form";
import EntryQrCard from "@/components/admin/event/edit/EntryQrCard";
import EventEditCancelDialog from "@/components/admin/event/edit/EventEditCancelDialog";
import { type StepFormHandle } from "@/types";
import { useAdminEventQuery } from "@/features/admin/events/adminEventQueries";
import { useUpdateEventMutation } from "@/features/admin/events/adminEventMutations";
import type { EventUpdatePayload } from "@/features/shared/types/stamply";
import LoadingSpinner from "@/components/ui/loading-spinner";

const TOTAL_STEPS = 3;

const EventEditPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const eventIdNum = Number(eventId);

  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const { data: event, isLoading } = useAdminEventQuery(eventIdNum);
  const { mutateAsync: updateEvent, isPending } = useUpdateEventMutation();

  const step1Ref = useRef<StepFormHandle>(null);
  const step2Ref = useRef<StepFormHandle>(null);
  const step3Ref = useRef<StepFormHandle>(null);
  const stepRefs = [step1Ref, step2Ref, step3Ref];

  const handlePrev = () => setCurrentStep((s) => Math.max(1, s - 1));
  const handleNext = () => setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));

  const handleEditStart = () => setMode("edit");

  const handleEditCancel = () => setCancelDialogOpen(true);

  const handleCancelConfirm = () => {
    setMode("view");
    setCancelDialogOpen(false);
    setFormKey((k) => k + 1);
  };

  const handleEditSave = async () => {
    const ref = stepRefs[currentStep - 1];
    if (!ref.current?.validate()) return;

    const [step1Data, step2Data, step3Data] = stepRefs.map((r) =>
      r.current?.getData()
    );
    const payload = {
      ...step1Data,
      ...step2Data,
      ...step3Data,
    } as EventUpdatePayload;

    await updateEvent({ eventId: eventIdNum, payload });
    toast.success("변경사항이 저장되었습니다.");
    setMode("view");
  };

  const entryQr = event?.qrCodes?.find((qr) => qr.type === "ENTRY");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-10 py-8">
      <div className="flex flex-col gap-4">
        {entryQr && <EntryQrCard token={entryQr.token} qrId={entryQr.id} />}

        <div className="rounded-xl border border-gomin-neutral-100 bg-white">
          <EventFormStepper currentStep={currentStep} />

          <div className="p-6">
            <div className={currentStep !== 1 ? "hidden" : ""}>
              <EventInfoForm
                key={formKey}
                ref={step1Ref}
                initialData={
                  event
                    ? {
                        ...event,
                        locationUrl: event.locationUrl ?? undefined,
                        operatingRemarks: event.operatingRemarks ?? undefined,
                        contactPhone: event.contactPhone ?? undefined,
                        contactEmail: event.contactEmail ?? undefined,
                      }
                    : undefined
                }
              />
            </div>
            <div className={currentStep !== 2 ? "hidden" : ""}>
              <EventBrochureForm
                key={formKey}
                ref={step2Ref}
                initialData={
                  event?.brochureImageUrl
                    ? { brochureImageUrl: event.brochureImageUrl }
                    : undefined
                }
              />
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
              onNext={handleNext}
              isLastStep={currentStep === TOTAL_STEPS}
              mode={mode}
              onEditStart={handleEditStart}
              onEditCancel={handleEditCancel}
              onEditSave={handleEditSave}
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <EventEditCancelDialog onConfirm={handleCancelConfirm} />
      </Dialog>
    </div>
  );
};

export default EventEditPage;
