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
import { formatPhoneNumber, stripInvisibleChars } from "@/utils";
import { eventInfoSchema } from "@/utils/schemas";

type FormState = z.infer<typeof eventInfoSchema>;

type DisabledField = keyof FormState;

type Props = {
  initialData?: Partial<FormState>;
  disabledFields?: "all" | DisabledField[];
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
  { initialData, disabledFields },
  ref
) {
  const isDisabled = (field: DisabledField) =>
    disabledFields === "all" ||
    (Array.isArray(disabledFields) && disabledFields.includes(field));
  const [form, setForm] = useState<FormState>({
    ...defaultForm,
    ...(initialData
      ? Object.fromEntries(
          Object.entries(initialData).filter(([, v]) => v !== undefined)
        )
      : {}),
  });
  const [isPosterUploading, setIsPosterUploading] = useState(false);
  const [zodError, setZodError] = useState<z.ZodError<FormState> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const cleaned = stripInvisibleChars(value).trim();
      const targetValue =
        name === "contactPhone" ? formatPhoneNumber(cleaned) : cleaned;
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
    const nextForm = { ...form, posterImageUrl: url };
    setForm(nextForm);

    if (zodError) {
      const result = eventInfoSchema.safeParse(nextForm);
      setZodError(result.error ?? null);
    }
  };

  const handlePosterRemove = () => {
    const nextForm = { ...form, posterImageUrl: "" };
    setForm(nextForm);

    if (zodError) {
      const result = eventInfoSchema.safeParse(nextForm);
      setZodError(result.error ?? null);
    }
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
            initialImageUrl={initialData?.posterImageUrl}
            onUploadStart={handlePosterUploadStart}
            onUploadSuccess={handlePosterUploadSuccess}
            onRemove={handlePosterRemove}
            disabled={isDisabled("posterImageUrl")}
          />

          <div className="flex flex-1 flex-col gap-4">
            <EventTitleField
              value={form.title}
              error={fieldErrors.title?.[0]}
              onChange={handleChange}
              disabled={isDisabled("title")}
            />
            <EventDateRangeField
              startDate={form.startDate}
              endDate={form.endDate}
              startDateError={fieldErrors.startDate?.[0]}
              endDateError={fieldErrors.endDate?.[0]}
              onChange={handleChange}
              disabled={isDisabled("startDate")}
            />
            <EventLocationField
              value={form.location}
              error={fieldErrors.location?.[0]}
              onChange={handleChange}
              disabled={isDisabled("location")}
            />
            <EventLocationUrlField
              value={form.locationUrl}
              error={fieldErrors.locationUrl?.[0]}
              onChange={handleChange}
              disabled={isDisabled("locationUrl")}
            />
            <div className="grid grid-cols-2 gap-4">
              <EventProductionField
                value={form.production}
                onChange={handleChange}
                disabled={isDisabled("production")}
              />
              <EventContactPhoneField
                value={form.contactPhone}
                error={fieldErrors.contactPhone?.[0]}
                onChange={handleChange}
                disabled={isDisabled("contactPhone")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <EventContactEmailField
                value={form.contactEmail}
                error={fieldErrors.contactEmail?.[0]}
                onChange={handleChange}
                disabled={isDisabled("contactEmail")}
              />
              <EventOperatingHoursField
                startTime={form.startTime}
                endTime={form.endTime}
                startTimeError={fieldErrors.startTime?.[0]}
                endTimeError={fieldErrors.endTime?.[0]}
                onChange={handleChange}
                disabled={isDisabled("startTime")}
              />
            </div>
            <EventRemarksField
              value={form.operatingRemarks}
              onChange={handleChange}
              disabled={isDisabled("operatingRemarks")}
            />
          </div>
        </div>
      </form>
    </div>
  );
});

export default EventInfoForm;
