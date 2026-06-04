import { ReactNode } from "react";

type InfoCardProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

const InfoCard = ({ label, children, className = "" }: InfoCardProps) => {
  return (
    <div
      className={`bg-white border border-gomin-primary-200 rounded-[20px] p-5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${className}`}
    >
      <span className="text-[12px] font-bold text-gomin-neutral-400 block mb-1.5">
        {label}
      </span>
      {children}
    </div>
  );
};

export default InfoCard;
