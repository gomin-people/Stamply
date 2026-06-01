"use client";

import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { z } from "zod";
import { type StepFormHandle } from "@/types";
import PosterImageField from "@/components/admin/event/info/PosterImageField";
import EventTitleField from "@/components/admin/event/info/EventTitleField";
import EventDateRangeField from "@/components/admin/event/info/EventDateRangeField";
import EventLocationField from "@/components/admin/event/info/EventLocationField";
import EventLocationUrlField from "@/components/admin/event/info/EventLocationUrlField";
import EventProductionField from "@/components/admin/event/info/EventProductionField";
import EventContactPhoneField from "@/components/admin/event/info/EventContactPhoneField";
import EventContactEmailField from "@/components/admin/event/info/EventContactEmailField";
import EventOperatingHoursField from "@/components/admin/event/info/EventOperatingHoursField";
import EventRemarksField from "@/components/admin/event/info/EventRemarksField";
import { formatPhoneNumber } from "@/utils";
import { eventInfoSchema } from "@/utils/schemas";

type FormState = z.infer<typeof eventInfoSchema>;

type Props = {
  initialData?: Partial<FormState>;
};

const defaultForm: FormState = {
  title: "",
  startDate: "",
  endDate: "",
  location: "",
  locationUrl: "",
  production: "",
  contactPhone: "",
  contactEmail: "",
  startTime: "",
  endTime: "",
  operatingRemarks: "",
  posterImageUrl: "",
};

const EventInfoForm = forwardRef<StepFormHandle, Props>(function EventInfoForm(
  { initialData },
  ref
) {
  const [form, setForm] = useState<FormState>({
    ...defaultForm,
    ...initialData,
  });
  const [isPosterUploading, setIsPosterUploading] = useState(false);
  const [zodError, setZodError] = useState<z.ZodError<FormState> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const targetValue =
        name === "contactPhone" ? formatPhoneNumber(value) : value;
      const nextForm = { ...form, [name]: targetValue };
      setForm(nextForm);

      if (zodError) {
        const result = eventInfoSchema.safeParse(nextForm);
        setZodError(result.error ?? null);
      }
    },
    [form, zodError]
  );

  const handlePosterUploadStart = () => {
    setIsPosterUploading(true);
  };

  const handlePosterUploadSuccess = (url: string) => {
    setIsPosterUploading(false);
    setForm((prev) => ({ ...prev, posterImageUrl: url }));
  };

  const handlePosterRemove = () => {
    setForm((prev) => ({ ...prev, posterImageUrl: "" }));
  };

  const validate = useCallback(() => {
    const result = eventInfoSchema.safeParse(form);
    setZodError(result.error ?? null);
    return !result.error;
  }, [form]);

  useImperativeHandle(
    ref,
    () => ({
      validate,
      getData: () => form,
    }),
    [form, validate]
  );

  const fieldErrors = zodError ? z.flattenError(zodError).fieldErrors : {};

  return (
    <div>
      <form>
        <div className="flex min-h-166 gap-8">
          <PosterImageField
            error={
              !isPosterUploading ? fieldErrors.posterImageUrl?.[0] : undefined
            }
            onUploadStart={handlePosterUploadStart}
            onUploadSuccess={handlePosterUploadSuccess}
            onRemove={handlePosterRemove}
          />

          <div className="flex flex-1 flex-col gap-4">
            <EventTitleField
              value={form.title}
              error={fieldErrors.title?.[0]}
              onChange={handleChange}
            />
            <EventDateRangeField
              startDate={form.startDate}
              endDate={form.endDate}
              startDateError={fieldErrors.startDate?.[0]}
              endDateError={fieldErrors.endDate?.[0]}
              onChange={handleChange}
            />
            <EventLocationField
              value={form.location}
              error={fieldErrors.location?.[0]}
              onChange={handleChange}
            />
            <EventLocationUrlField
              value={form.locationUrl}
              error={fieldErrors.locationUrl?.[0]}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <EventProductionField
                value={form.production}
                onChange={handleChange}
              />
              <EventContactPhoneField
                value={form.contactPhone}
                error={fieldErrors.contactPhone?.[0]}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <EventContactEmailField
                value={form.contactEmail}
                error={fieldErrors.contactEmail?.[0]}
                onChange={handleChange}
              />
              <EventOperatingHoursField
                startTime={form.startTime}
                endTime={form.endTime}
                onChange={handleChange}
              />
            </div>
            <EventRemarksField
              value={form.operatingRemarks}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
});

export default EventInfoForm;
