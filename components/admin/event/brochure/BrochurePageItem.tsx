"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, RefreshCw, Trash2 } from "lucide-react";
import BrochureThumbnail from "./BrochureThumbnail";
import type { UploadPage } from "@/hooks/usePageUpload";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";

type ItemProps = {
  page: UploadPage;
  index: number;
  onReplace: () => void;
  onDelete: () => void;
  disabled?: boolean;
};

// 파일 크기(bytes)를 읽기 좋게 변환하는 함수
function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

const BrochurePageItem = ({
  page,
  index,
  onReplace,
  onDelete,
  disabled = false,
}: ItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id, disabled });

  // dnd-kit는 tailwind로 제어할 수 없어서 인라인으로 써야함.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "grid h-22 grid-cols-[24px_44px_1fr_70px] items-center gap-4 rounded-2xl border border-gomin-neutral-100 bg-white py-3 pl-2 pr-4",
        isDragging && "opacity-50"
      )}
    >
      <GripVertical
        className={cn(
          "size-3.5 touch-none text-gomin-neutral-400 focus:outline-none",
          disabled ? "cursor-not-allowed opacity-30" : "cursor-grab"
        )}
        {...attributes}
        {...(!disabled && listeners)}
      />

      <BrochureThumbnail file={page.file} previewUrl={page.previewUrl} />

      <div className="flex flex-col gap-0.5 overflow-hidden">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gomin-primary-700">
          PAGE {String(index + 1).padStart(2, "0")}
        </span>
        {page.file && (
          <>
            <span className="truncate text-[13px] font-medium text-gomin-black">
              {page.file.name}
            </span>
            <span className="text-[11px] font-medium text-gomin-neutral-400">
              {formatFileSize(page.file.size)}
            </span>
          </>
        )}
      </div>

      {!disabled && (
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            onClick={onReplace}
            className="flex size-8 items-center justify-center rounded-lg border border-gomin-neutral-100 bg-white hover:bg-gomin-neutral-100"
            aria-label="교체"
          >
            <RefreshCw className="size-3.5 text-gomin-neutral-400" />
          </Button>
          <Button
            type="button"
            onClick={onDelete}
            className="flex size-8 items-center justify-center rounded-lg border border-gomin-neutral-100 bg-white hover:bg-gomin-neutral-100"
            aria-label="삭제"
          >
            <Trash2 className="size-3.5 text-gomin-neutral-400" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BrochurePageItem;
