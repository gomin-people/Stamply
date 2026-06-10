import { Info } from "lucide-react";

type Props = {
  message: string;
};

const InfoBanner = ({ message }: Props) => {
  return (
    <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-gomin-primary-100/50 border border-gomin-primary-100 text-gomin-primary-700/90">
      <Info className="w-5 h-5 shrink-0" />
      <p className="text-xs font-bold leading-normal">{message}</p>
    </div>
  );
};

export default InfoBanner;
