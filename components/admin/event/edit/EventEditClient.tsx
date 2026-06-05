"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import EventFormStepper from "@/components/admin/event/EventFormStepper";
import EventFormFooter from "@/components/admin/event/EventFormFooter";
import EventInfoForm from "@/components/admin/event/EventInfoForm";
import EventBrochureForm from "@/components/admin/event/EventBrochureForm";
import EventThemeStampForm from "@/components/admin/event/EventThemeStampForm";
import EntryQrCard from "@/components/admin/event/edit/EntryQrCard";
import EventEditCancelDialog from "@/components/admin/event/edit/EventEditCancelDialog";
import EventDeleteDialog from "@/components/admin/event/edit/EventDeleteDialog";
import { type StepFormHandle } from "@/types";
import {
  useAdminEventQuery,
  useAdminEventsQuery,
} from "@/features/admin/events/adminEventQueries";
import {
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "@/features/admin/events/adminEventMutations";
import type { EventUpdatePayload } from "@/features/shared/types/stamply";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { getEventOperationStatus } from "@/utils/event-status";
import {
  useSetIsEditMode,
  useSetPendingHref,
  usePendingHref,
} from "@/stores/admin";

const TOTAL_STEPS = 3;

export default function EventEditClient() {
  const { eventId } = useParams<{ eventId: string }>();
  const eventIdNum = Number(eventId);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const setIsEditMode = useSetIsEditMode();
  const setPendingHref = useSetPendingHref();
  const pendingHref = usePendingHref();

  useEffect(() => {
    setIsEditMode(mode === "edit");
    return () => {
      setIsEditMode(false);
    };
  }, [mode, setIsEditMode]);

  const { data: event, isLoading } = useAdminEventQuery(eventIdNum);
  const { data: events = [] } = useAdminEventsQuery();
  const { mutateAsync: updateEvent, isPending } = useUpdateEventMutation();
  const { mutateAsync: deleteEvent } = useDeleteEventMutation();

  const operationStatus = event
    ? getEventOperationStatus(event.startDate, event.endDate)
    : null;
  const isAfter = operationStatus === "after";
  const isDuring = operationStatus === "during";

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

  const handleDeleteConfirm = async () => {
    try {
      await deleteEvent(eventIdNum);
      toast.success("행사가 삭제되었습니다.");
      const nextEvent = events.find((e) => e.id !== eventIdNum);
      router.replace(
        nextEvent ? `/admin/events/${nextEvent.id}` : "/admin/events/register"
      );
    } catch {
      toast.error("삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleLeaveConfirm = () => {
    const href = pendingHref;
    setPendingHref(null);
    if (href) {
      router.push(href);
    }
  };

  const handleLeaveDialogClose = (open: boolean) => {
    if (!open) setPendingHref(null);
  };

  const handleEditSave = async () => {
    const isValid = stepRefs.every((r) => r.current?.validate());
    if (!isValid) {
      setCurrentStep(1);
      toast.warning("필수 항목을 확인해주세요.");
      return;
    }

    const [step1Data, step2Data, step3Data] = stepRefs.map((r) =>
      r.current?.getData()
    );
    const payload = {
      ...step1Data,
      ...step2Data,
      ...step3Data,
    } as EventUpdatePayload;

    try {
      await updateEvent({ eventId: eventIdNum, payload });
      toast.success("변경사항이 저장되었습니다.");
      setMode("view");
    } catch {
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const entryQr = event?.qrCodes?.find((qr) => qr.type === "ENTRY");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-10 py-8">
      <div className="flex flex-col gap-4">
        {entryQr && (
          <EntryQrCard
            token={entryQr.token}
            qrId={entryQr.id}
            onDeleteTrigger={() => setDeleteDialogOpen(true)}
            disabled={isAfter}
          />
        )}

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
                disabledFields={
                  mode === "view" || isAfter
                    ? "all"
                    : isDuring
                      ? ["startDate", "endDate", "posterImageUrl", "production"]
                      : undefined
                }
              />
            </div>
            <div className={currentStep !== 2 ? "hidden" : ""}>
              <EventBrochureForm
                key={formKey}
                ref={step2Ref}
                disabled={mode === "view" || isAfter || isDuring}
                initialData={
                  event?.brochureImageUrl
                    ? { brochureImageUrl: event.brochureImageUrl }
                    : undefined
                }
              />
            </div>
            <div className={currentStep !== 3 ? "hidden" : ""}>
              <EventThemeStampForm
                key={formKey}
                ref={step3Ref}
                disabled={mode === "view" || isAfter || isDuring}
                initialData={
                  event
                    ? {
                        stampImageUrl: event.stampImageUrl,
                        primaryColor: event.primaryColor,
                      }
                    : undefined
                }
              />
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
              onEditStart={isAfter ? undefined : handleEditStart}
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <EventDeleteDialog onConfirm={handleDeleteConfirm} />
      </Dialog>

      <Dialog open={!!pendingHref} onOpenChange={handleLeaveDialogClose}>
        <EventEditCancelDialog onConfirm={handleLeaveConfirm} />
      </Dialog>
    </div>
  );
}
