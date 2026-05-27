"use client";
import { memo } from "react";
import { MapPin } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  error?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const EventLocationField = memo(function EventLocationField({
  value,
  error,
  onChange,
}: Props) {
  return (
    <Field data-invalid={error}>
      <FieldLabel htmlFor="location">
        주소 <span className="text-destructive">*</span>
      </FieldLabel>
      <div className="relative">
        <MapPin className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="location"
          name="location"
          value={value}
          onChange={onChange}
          placeholder="행사 주소를 입력해주세요."
          className="pl-8"
          maxLength={100}
          aria-invalid={error}
        />
      </div>
    </Field>
  );
});

export default EventLocationField;
