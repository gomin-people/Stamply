"use client";
import { memo } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  startDate: string;
  endDate: string;
  startDateError?: string;
  endDateError?: string;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const EventDateRangeField = memo(function EventDateRangeField({
  startDate,
  endDate,
  startDateError,
  endDateError,
  disabled,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field data-invalid={!!startDateError}>
        <FieldLabel htmlFor="startDate">
          시작일 <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={startDate}
          onChange={onChange}
          aria-invalid={!!startDateError}
          disabled={disabled}
        />
        <div className="h-3">
          <FieldError>{startDateError}</FieldError>
        </div>
      </Field>
      <Field data-invalid={!!endDateError}>
        <FieldLabel htmlFor="endDate">
          종료일 <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={endDate}
          onChange={onChange}
          aria-invalid={!!endDateError}
          disabled={disabled}
        />
        <div className="h-3">
          <FieldError>{endDateError}</FieldError>
        </div>
      </Field>
    </div>
  );
});

export default EventDateRangeField;
