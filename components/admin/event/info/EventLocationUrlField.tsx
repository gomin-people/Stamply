"use client";
import { memo } from "react";
import { Link2 } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  error?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const EventLocationUrlField = memo(function EventLocationUrlField({
  value,
  error,
  onChange,
}: Props) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor="locationUrl">주소 지도 링크</FieldLabel>
      <div className="relative">
        <Link2 className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="locationUrl"
          name="locationUrl"
          value={value}
          onChange={onChange}
          placeholder="행사 지도 링크를 입력해주세요."
          className="pl-8"
          maxLength={100}
          aria-invalid={!!error}
        />
      </div>
      <div className="h-3">
        <FieldError>{error}</FieldError>
      </div>
    </Field>
  );
});

export default EventLocationUrlField;
