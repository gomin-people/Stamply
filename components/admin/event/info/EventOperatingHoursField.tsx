"use client";
import { memo } from "react";
import { Field, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  startTime: string;
  endTime: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const EventOperatingHoursField = memo(function EventOperatingHoursField({
  startTime,
  endTime,
  onChange,
}: Props) {
  return (
    <Field>
      <FieldTitle>운영시간</FieldTitle>
      <div className="flex items-center gap-2">
        <Input
          name="startTime"
          type="time"
          value={startTime}
          onChange={onChange}
        />
        <span className="shrink-0 text-muted-foreground">~</span>
        <Input name="endTime" type="time" value={endTime} onChange={onChange} />
      </div>
    </Field>
  );
});

export default EventOperatingHoursField;
