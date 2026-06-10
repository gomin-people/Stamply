"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useParticipantEventQuery } from "@/features/participant/events/participantEventQueries";
import InfoCard from "@/components/user/common/InfoCard";
import EventDateTimeCard from "@/components/user/event/EventDateTimeCard";
import EventHostCard from "@/components/user/event/EventHostCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const {
    data: event,
    isLoading,
    isError,
  } = useParticipantEventQuery(Number(eventId));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <p className="text-[16px] font-bold text-gomin-neutral-700 mb-2">
          존재하지 않거나 불러올 수 없는 행사입니다.
        </p>
        <p className="text-[14px] text-gomin-neutral-400">
          행사 ID를 다시 확인해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col w-full max-w-md mx-auto relative select-none">
      {/* 1. 대형 포스터 이미지 */}
      <div className="px-6 mt-6">
        {event.posterImageUrl && (
          <div className="relative w-full aspect-[3/4] rounded-[24px] overflow-hidden shadow-md border border-gomin-neutral-100">
            <Image
              src={event.posterImageUrl}
              alt="행사 포스터"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 448px) 100vw, 400px"
            />
          </div>
        )}
      </div>

      {/* 3. 보라색(라벤더) 카드 컨테이너 영역 */}
      <div className="bg-gomin-primary-100 rounded-t-[32px] p-6 flex flex-col gap-4.5 mt-6 flex-1">
        {/* 카드 1: 행사명 */}
        <InfoCard label="행사명">
          <h2 className="text-[17px] font-nanum font-extrabold text-gomin-primary-700">
            {event.title}
          </h2>
        </InfoCard>

        {/* 카드 2: 운영 기간 및 시간 */}
        <EventDateTimeCard
          startDate={event.startDate || ""}
          endDate={event.endDate || ""}
          startTime={event.startTime}
          endTime={event.endTime}
        />

        {/* 카드 3: 행사 장소 */}
        <InfoCard label="행사 장소">
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-bold text-gomin-neutral-700">
              {event.location}
            </span>
            {event.locationUrl && (
              <a
                href={event.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-nanum font-extrabold text-gomin-primary-700 hover:underline cursor-pointer"
              >
                지도보기
              </a>
            )}
          </div>
        </InfoCard>

        {/* 카드 4: 주최측 정보 */}
        <EventHostCard
          production={event.production}
          contactPhone={event.contactPhone}
          contactEmail={event.contactEmail}
        />

        {/* 카드 5: 비고 */}
        <InfoCard label="비고">
          <p className="text-[14px] text-gomin-neutral-700 font-semibold whitespace-pre-line leading-relaxed">
            {event.operatingRemarks || "특이사항이 없습니다."}
          </p>
        </InfoCard>
      </div>
    </div>
  );
};

export default EventDetailPage;
