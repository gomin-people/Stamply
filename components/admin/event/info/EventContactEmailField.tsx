"use client";
import { memo } from "react";
import { Mail } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  error?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const EventContactEmailField = memo(function EventContactEmailField({
  value,
  error,
  onChange,
}: Props) {
  return (
    <Field data-invalid={error}>
      <FieldLabel htmlFor="contactEmail">문의처 이메일</FieldLabel>
      <div className="relative">
        <Mail className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={value}
          onChange={onChange}
          placeholder="문의처 이메일을 입력해주세요."
          className="pl-8"
          maxLength={254}
          aria-invalid={error}
        />
      </div>
    </Field>
  );
});

export default EventContactEmailField;
