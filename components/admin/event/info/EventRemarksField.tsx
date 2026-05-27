"use client";
import { memo } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
};

const EventRemarksField = memo(function EventRemarksField({
  value,
  onChange,
}: Props) {
  return (
    <Field>
      <FieldLabel htmlFor="operatingRemarks">비고</FieldLabel>
      <Textarea
        id="operatingRemarks"
        name="operatingRemarks"
        value={value}
        onChange={onChange}
        placeholder="운영상의 특이사항을 입력해주세요."
        rows={3}
        maxLength={1000}
        className="resize-none"
      />
    </Field>
  );
});

export default EventRemarksField;
