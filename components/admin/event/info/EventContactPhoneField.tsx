"use client";
import { memo } from "react";
import { Phone } from "lucide-react";
import { useController, type Control } from "react-hook-form";
import { z } from "zod";
import { EventInfoSchema } from "@/types/schemas/adminEventInfoSchemas";
import { formatPhoneNumber, stripInvisibleChars } from "@/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FormState = z.infer<typeof EventInfoSchema>;

type Props = {
  control: Control<FormState>;
  disabled?: boolean;
};

const EventContactPhoneField = memo(function EventContactPhoneField({
  control,
  disabled,
}: Props) {
  const { field, fieldState } = useController({
    control,
    name: "contactPhone",
  });
  const value = field.value;
  const error = fieldState.error?.message;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    field.onChange(
      formatPhoneNumber(stripInvisibleChars(e.target.value).trim())
    );

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor="contactPhone">문의처 전화번호</FieldLabel>
      <div className="relative">
        <Phone className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="contactPhone"
          name="contactPhone"
          value={value}
          onChange={handleChange}
          placeholder="000-0000-0000"
          className="pl-8"
          maxLength={13}
          aria-invalid={!!error}
          disabled={disabled}
        />
      </div>
      <div className="h-3">
        <FieldError>{error}</FieldError>
      </div>
    </Field>
  );
});

export default EventContactPhoneField;
