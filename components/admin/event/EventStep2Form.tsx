"use client";
import { forwardRef, useImperativeHandle } from "react";

import { type StepFormHandle } from "@/types";

const EventStep2Form = forwardRef<StepFormHandle>(
  function EventStep2Form(_, ref) {
    useImperativeHandle(ref, () => ({
      validate: () => true,
      getData: () => ({}),
    }));

    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-gomin-neutral-400">
        브로슈어 업로드
      </div>
    );
  }
);

export default EventStep2Form;
