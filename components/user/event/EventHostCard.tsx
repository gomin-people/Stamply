import InfoCard from "@/components/user/common/InfoCard";

type EventHostCardProps = {
  production?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
};

const EventHostCard = ({
  production,
  contactPhone,
  contactEmail,
}: EventHostCardProps) => {
  return (
    <InfoCard label="주최측 정보">
      <div className="flex justify-between items-start">
        <span className="text-[15px] font-bold text-gomin-neutral-700">
          {production}
        </span>
        <div className="flex flex-col items-end text-right gap-0.5">
          {contactPhone && (
            <span className="text-[14px] font-nanum font-extrabold text-gomin-primary-700">
              {contactPhone}
            </span>
          )}
          {contactEmail && (
            <span className="text-[14px] font-nanum font-extrabold text-gomin-primary-700">
              {contactEmail}
            </span>
          )}
        </div>
      </div>
    </InfoCard>
  );
};

export default EventHostCard;
