"use client";

import { useWatch, Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/utils";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  maxLength: number;
  disabled?: boolean;
  className?: string;
};

function CharCount<T extends FieldValues>({
  control,
  name,
  maxLength,
  disabled,
  className,
}: Props<T>) {
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
}

export default CharCount;
