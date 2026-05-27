"use client";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

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
import {
  formatPhoneNumber,
  isValidEmail,
  isValidPhone,
  isValidUrl,
} from "@/utils";

type FormState = {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  locationUrl: string;
  production: string;
  contactPhone: string;
  contactEmail: string;
  startTime: string;
  endTime: string;
  operatingRemarks: string;
  posterImageUrl: string;
};

const initialForm: FormState = {
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

type FormErrors = {
  poster: boolean;
  title: boolean;
  startDate: boolean;
  endDate: boolean;
  location: boolean;
  locationUrl: boolean;
  contactPhone: boolean;
  contactEmail: boolean;
};

const initialErrors: FormErrors = {
  poster: false,
  title: false,
  startDate: false,
  endDate: false,
  location: false,
  locationUrl: false,
  contactPhone: false,
  contactEmail: false,
};

const EventInfoForm = forwardRef<StepFormHandle>(
  function EventInfoForm(_, ref) {
    const [form, setForm] = useState<FormState>(initialForm);
    const [isPosterUploading, setIsPosterUploading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>(initialErrors);

    const clearError = useCallback((key: keyof FormErrors) => {
      setErrors((prev) => ({ ...prev, [key]: false }));
    }, []);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const targetValue =
          name === "contactPhone" ? formatPhoneNumber(value) : value;
        setForm((prev) => ({ ...prev, [name]: targetValue }));
        if (name === "title" && value.trim()) clearError("title");
        if (name === "startDate" && value) {
          clearError("startDate");
          if (form.endDate) {
            if (value > form.endDate)
              setErrors((prev) => ({ ...prev, endDate: true }));
            else clearError("endDate");
          }
        }
        if (
          name === "endDate" &&
          value &&
          (!form.startDate || value >= form.startDate)
        )
          clearError("endDate");
        if (name === "location" && value.trim()) clearError("location");
        if (name === "locationUrl" && (!value || isValidUrl(value)))
          clearError("locationUrl");
        if (
          name === "contactPhone" &&
          (!targetValue || isValidPhone(targetValue))
        )
          clearError("contactPhone");
        if (name === "contactEmail" && (!value || isValidEmail(value)))
          clearError("contactEmail");
      },
      [clearError, form.startDate, form.endDate]
    );

    const handlePosterUploadStart = () => {
      setIsPosterUploading(true);
    };

    const handlePosterUploadSuccess = (url: string) => {
      setIsPosterUploading(false);
      setForm((prev) => ({ ...prev, posterImageUrl: url }));
      clearError("poster");
    };

    const handlePosterRemove = () => {
      setForm((prev) => ({ ...prev, posterImageUrl: "" }));
    };

    const validate = () => {
      const next: FormErrors = {
        poster: !form.posterImageUrl && !isPosterUploading,
        title: !form.title.trim(),
        startDate: !form.startDate,
        endDate:
          !form.endDate || (!!form.startDate && form.endDate < form.startDate),
        location: !form.location.trim(),
        locationUrl: !!form.locationUrl && !isValidUrl(form.locationUrl),
        contactPhone: !!form.contactPhone && !isValidPhone(form.contactPhone),
        contactEmail: !!form.contactEmail && !isValidEmail(form.contactEmail),
      };
      setErrors(next);
      return Object.values(next).every((v) => !v);
    };

    useImperativeHandle(
      ref,
      () => ({
        validate,
        getData: () => form,
      }),
      [form]
    );

    return (
      <div>
        <form>
          <div className="flex gap-8">
            <PosterImageField
              error={errors.poster}
              onUploadStart={handlePosterUploadStart}
              onUploadSuccess={handlePosterUploadSuccess}
              onRemove={handlePosterRemove}
            />

            <div className="flex flex-1 flex-col gap-5">
              <EventTitleField
                value={form.title}
                error={errors.title}
                onChange={handleChange}
              />
              <EventDateRangeField
                startDate={form.startDate}
                endDate={form.endDate}
                startDateError={errors.startDate}
                endDateError={errors.endDate}
                onChange={handleChange}
              />
              <EventLocationField
                value={form.location}
                error={errors.location}
                onChange={handleChange}
              />
              <EventLocationUrlField
                value={form.locationUrl}
                error={errors.locationUrl}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <EventProductionField
                  value={form.production}
                  onChange={handleChange}
                />
                <EventContactPhoneField
                  value={form.contactPhone}
                  error={errors.contactPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <EventContactEmailField
                  value={form.contactEmail}
                  error={errors.contactEmail}
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
  }
);

export default EventInfoForm;
