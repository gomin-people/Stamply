"use client";

import { useParams } from "next/navigation";
import { useParticipantEventQuery } from "@/features/participant/events/participantEventQueries";

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const { data: event, isLoading } = useParticipantEventQuery(Number(eventId));

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const weekDay = weekDays[date.getDay()];
      return `${year}년 ${month}월 ${day}일 (${weekDay})`;
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="size-8 border-4 border-gomin-primary-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col w-full max-w-md mx-auto relative select-none">
      {/* 1. 대형 포스터 이미지 */}
      <div className="px-6 mt-6">
        {event?.posterImageUrl && (
          <img
            src={event.posterImageUrl}
            alt="행사 포스터"
            className="w-full aspect-[3/4] object-cover rounded-[24px] shadow-md border border-gomin-neutral-100"
          />
        )}
      </div>

      {/* 3. 보라색(라벤더) 카드 컨테이너 영역 */}
      <div className="bg-gomin-primary-100 rounded-t-[32px] p-6 flex flex-col gap-4.5 mt-6 flex-1">
        {/* 카드 1: 행사명 */}
        <div className="bg-white border border-gomin-primary-200 rounded-[20px] p-5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <span className="text-[12px] font-bold text-gomin-neutral-400">
            행사명
          </span>
          <h2 className="text-[17px] font-nanum font-extrabold text-gomin-primary-700 mt-1.5">
            {event?.title}
          </h2>
        </div>

        {/* 카드 2: 운영 기간 및 시간 */}
        <div className="bg-white border border-gomin-primary-200 rounded-[20px] p-5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col">
          <span className="text-[12px] font-bold text-gomin-neutral-400 mb-3">
            운영 기간 및 시간
          </span>
          <div className="flex flex-col gap-2 text-[14px]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gomin-neutral-500 w-12">
                시작일
              </span>
              <span className="font-extrabold text-gomin-primary-700">
                {formatDate(event?.startDate || "")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gomin-neutral-500 w-12">
                종료일
              </span>
              <span className="font-extrabold text-gomin-primary-700">
                {formatDate(event?.endDate || "")}
              </span>
            </div>
            <div className="flex flex-col mt-1">
              <span className="font-semibold text-gomin-neutral-500">
                운영시간
              </span>
              <span className="font-extrabold text-gomin-primary-700 pl-4 mt-0.5">
                {event?.operatingRemarks ? `${event.operatingRemarks} ` : ""}
                {event?.startTime
                  ? `${event.startTime.slice(0, 5)} ~ ${event.endTime.slice(0, 5)}`
                  : ""}
              </span>
            </div>
          </div>
        </div>

        {/* 카드 3: 행사 장소 */}
        <div className="bg-white border border-gomin-primary-200 rounded-[20px] p-5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <span className="text-[12px] font-bold text-gomin-neutral-400">
            행사 장소
          </span>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[15px] font-bold text-gomin-neutral-700">
              {event?.location}
            </span>
            {event?.locationUrl && (
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
        </div>

        {/* 카드 4: 주최측 정보 */}
        <div className="bg-white border border-gomin-primary-200 rounded-[20px] p-5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <span className="text-[12px] font-bold text-gomin-neutral-400">
            주최측 정보
          </span>
          <div className="flex justify-between items-start mt-1.5">
            <span className="text-[15px] font-bold text-gomin-neutral-700">
              {event?.production}
            </span>
            <div className="flex flex-col items-end text-right gap-0.5">
              {event?.contactPhone && (
                <span className="text-[14px] font-nanum font-extrabold text-gomin-primary-700">
                  {event.contactPhone}
                </span>
              )}
              {event?.contactEmail && (
                <span className="text-[14px] font-nanum font-extrabold text-gomin-primary-700">
                  {event.contactEmail}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 카드 5: 비고 */}
        <div className="bg-white border border-gomin-primary-200 rounded-[20px] p-5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <span className="text-[12px] font-bold text-gomin-neutral-400">
            비고
          </span>
          <p className="text-[14px] text-gomin-neutral-700 font-semibold mt-1.5 whitespace-pre-line leading-relaxed">
            {event?.notice || "특이사항이 없습니다."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
