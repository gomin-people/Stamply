import { GripVertical } from "lucide-react";
import { MAX_PAGES } from "@/constants";

type StatusProps = {
  count: number;
};

const BrochurePageStatus = ({ count }: StatusProps) => {
  return (
    <div className="flex h-8 items-center justify-between">
      <span className="text-[13px] font-medium text-gomin-neutral-400">
        업로드된 페이지 <span className="text-gomin-primary-700">{count}</span>{" "}
        / {MAX_PAGES}
      </span>
      {count > 0 && (
        <div className="flex items-center gap-1">
          <GripVertical className="size-3 text-gomin-neutral-400" />
          <span className="text-[13px] font-medium text-gomin-neutral-400">
            위·아래로 드래그해서 순서 변경
          </span>
        </div>
      )}
    </div>
  );
};

export default BrochurePageStatus;
