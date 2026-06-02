"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type BrochureEventButtonProps = {
  className?: string;
};

const BrochureEventButton = ({ className = "" }: BrochureEventButtonProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  return (
    <Link
      href={`/event/${eventId}/detail`}
      className={`w-71.75 h-10.75 bg-gomin-neutral-600 rounded-[20px] text-gomin-white font-bold text-sm flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer ${className}`}
    >
      행사 상세 정보
    </Link>
  );
};

export default BrochureEventButton;
