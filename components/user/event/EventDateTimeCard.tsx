import InfoCard from "@/components/user/common/InfoCard";
import { formatDate } from "@/utils";

type EventDateTimeCardProps = {
  startDate: string;
  endDate: string;
  operatingRemarks?: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

const EventDateTimeCard = ({
  startDate,
  endDate,
  operatingRemarks,
  startTime,
  endTime,
}: EventDateTimeCardProps) => {
  return (
    <InfoCard label="운영 기간 및 시간">
      <div className="flex flex-col gap-2 text-[14px]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gomin-neutral-500 w-12">
            시작일
          </span>
          <span className="font-extrabold text-gomin-primary-700">
            {formatDate(startDate)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gomin-neutral-500 w-12">
            종료일
          </span>
          <span className="font-extrabold text-gomin-primary-700">
            {formatDate(endDate)}
          </span>
        </div>
        <div className="flex flex-col mt-1">
          <span className="font-semibold text-gomin-neutral-500">운영시간</span>
          <span className="font-extrabold text-gomin-primary-700 pl-4 mt-0.5">
            {operatingRemarks ? `${operatingRemarks} ` : ""}
            {startTime
              ? `${startTime.slice(0, 5)} ~ ${endTime?.slice(0, 5)}`
              : ""}
          </span>
        </div>
      </div>
    </InfoCard>
  );
};

export default EventDateTimeCard;
