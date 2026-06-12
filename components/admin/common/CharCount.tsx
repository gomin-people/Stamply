"use client";

import { useWatch, useFormContext } from "react-hook-form";
import { cn } from "@/utils";

type Props = {
  name: string;
  maxLength: number;
  disabled?: boolean;
  className?: string;
};

const CharCount = ({ name, maxLength, disabled, className }: Props) => {
  const { control } = useFormContext();
  const value = useWatch({ control, name }) ?? "";
  const current = String(value).length;

  return (
    <span
      className={cn(
        "text-xs pointer-events-none",
        disabled ? "text-muted-foreground/60" : "text-muted-foreground",
        className
      )}
    >
      {current}/{maxLength}
    </span>
  );
};

export default CharCount;
