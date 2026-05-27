"use client";
import { memo } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  startDate: string;
  endDate: string;
  startDateError?: boolean;
  endDateError?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const EventDateRangeField = memo(function EventDateRangeField({
  startDate,
  endDate,
  startDateError,
  endDateError,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field data-invalid={startDateError}>
        <FieldLabel htmlFor="startDate">
          시작일 <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={startDate}
          onChange={onChange}
          aria-invalid={startDateError}
        />
      </Field>
      <Field data-invalid={endDateError}>
        <FieldLabel htmlFor="endDate">
          종료일 <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={endDate}
          onChange={onChange}
          aria-invalid={endDateError}
        />
      </Field>
    </div>
  );
});

export default EventDateRangeField;
