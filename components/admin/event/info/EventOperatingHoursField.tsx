"use client";
import { memo } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  startTime: string;
  endTime: string;
  startTimeError?: string;
  endTimeError?: string;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const EventOperatingHoursField = memo(function EventOperatingHoursField({
  startTime,
  endTime,
  startTimeError,
  endTimeError,
  disabled,
  onChange,
}: Props) {
  const error = startTimeError || endTimeError;
  return (
    <Field data-invalid={!!error}>
      <FieldLabel>
        운영시간 <span className="text-destructive">*</span>
      </FieldLabel>
      <div className="flex items-center gap-2">
        <Input
          name="startTime"
          type="time"
          value={startTime}
          onChange={onChange}
          aria-invalid={!!startTimeError}
          disabled={disabled}
        />
        <span className="shrink-0 text-muted-foreground">~</span>
        <Input
          name="endTime"
          type="time"
          value={endTime}
          onChange={onChange}
          aria-invalid={!!endTimeError}
          disabled={disabled}
        />
      </div>
      <div className="h-3">
        <FieldError>{error}</FieldError>
      </div>
    </Field>
  );
});

export default EventOperatingHoursField;
