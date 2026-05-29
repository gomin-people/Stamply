"use client";
import { forwardRef, useImperativeHandle } from "react";

import { type StepFormHandle } from "@/types";

const EventStep3Form = forwardRef<StepFormHandle>(
  function EventStep3Form(_, ref) {
    useImperativeHandle(ref, () => ({
      validate: () => true,
      getData: () => ({}),
    }));

    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-gomin-neutral-400">
        스탬프 · 테마색상
      </div>
    );
  }
);

export default EventStep3Form;
