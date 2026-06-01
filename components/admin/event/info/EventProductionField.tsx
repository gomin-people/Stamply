"use client";
import { memo } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const EventProductionField = memo(function EventProductionField({
  value,
  disabled,
  onChange,
}: Props) {
  return (
    <Field>
      <FieldLabel htmlFor="production">문의처 명</FieldLabel>
      <Input
        id="production"
        name="production"
        value={value}
        onChange={onChange}
        placeholder="문의처 명을 입력해주세요."
        maxLength={100}
        disabled={disabled}
      />
    </Field>
  );
});

export default EventProductionField;
