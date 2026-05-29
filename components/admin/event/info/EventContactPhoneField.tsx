"use client";
import { memo } from "react";
import { Phone } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const EventContactPhoneField = memo(function EventContactPhoneField({
  value,
  error,
  onChange,
}: Props) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor="contactPhone">문의처 전화번호</FieldLabel>
      <div className="relative">
        <Phone className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="contactPhone"
          name="contactPhone"
          value={value}
          onChange={onChange}
          placeholder="000-0000-0000"
          className="pl-8"
          maxLength={13}
          aria-invalid={!!error}
        />
      </div>
      <div className="h-3">
        <FieldError>{error}</FieldError>
      </div>
    </Field>
  );
});

export default EventContactPhoneField;
