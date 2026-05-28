'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const BrochureEventButton = () => {
  const { eventId } = useParams<{ eventId: string }>();
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
      <Link
        // 행사 상세 페이지가 들어가야합니다. 우진님이 상세 페이지 생성 후 바꿔주시면 됩니다.
        href={`/event/${eventId}`}
        className="mt-4 w-71.75 h-10.75 bg-gomin-neutral-600 rounded-[20px] text-gomin-white font-bold text-sm flex items-center justify-center"
      >
        행사 상세 정보
      </Link>
    </div>
  );
};

export default BrochureEventButton;
