"use client";
import { memo } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const EventTitleField = memo(function EventTitleField({
  value,
  error,
  disabled,
  onChange,
}: Props) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor="title">
        행사 명 <span className="text-destructive">*</span>
      </FieldLabel>
      <Input
        id="title"
        name="title"
        value={value}
        onChange={onChange}
        placeholder="행사명을 입력해주세요."
        maxLength={20}
        aria-invalid={!!error}
        disabled={disabled}
      />
      <div className="h-3">
        <FieldError>{error}</FieldError>
      </div>
    </Field>
  );
});

export default EventTitleField;
