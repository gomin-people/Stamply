"use client";

import { type ComponentProps } from "react";
import { cn } from "@/utils";

type SkeletonProps = ComponentProps<"div">;

const Skeleton = ({ className, ...rest }: SkeletonProps) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...rest}
    />
  );
};

export default Skeleton;
