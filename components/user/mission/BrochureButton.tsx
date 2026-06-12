"use client";

import Link from "next/link";
import { Newspaper } from "lucide-react";
import { cn } from "@/utils";

type BrochureButtonProps = {
  eventId: string;
  className?: string;
};

export default function BrochureButton({
  eventId,
  className,
}: BrochureButtonProps) {
  return (
    <Link
      href={`/event/${eventId}/brochure?from=mission`}
      className={cn(
        "flex items-center justify-center w-13 h-13 shrink-0 rounded-full border-2 border-gomin-primary-700 bg-gomin-white text-gomin-primary-700 hover:bg-gomin-primary-100/50 active:scale-95 transition-all duration-200 shadow-md",
        className
      )}
      aria-label="브로슈어 안내장 보기"
    >
      <Newspaper className="w-6 h-6" />
    </Link>
  );
}
