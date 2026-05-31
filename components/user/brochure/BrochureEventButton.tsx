"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const BrochureEventButton = () => {
  const { eventId } = useParams<{ eventId: string }>();
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50 flex justify-center">
      <Link
        href={`/event/${eventId}/detail`}
        className="mt-4 w-71.75 h-10.75 bg-gomin-neutral-600 rounded-[20px] text-gomin-white font-bold text-sm flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
      >
        행사 상세 정보
      </Link>
    </div>
  );
};

export default BrochureEventButton;
