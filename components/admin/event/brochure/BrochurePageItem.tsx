"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, RefreshCw, Trash2 } from "lucide-react";
import BrochureThumbnail from "./BrochureThumbnail";

type BrochurePage = {
  id: string;
  file: File;
  previewUrl: string;
};

type Props = {
  page: BrochurePage;
  index: number;
  onReplace: () => void;
  onDelete: () => void;
};

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

const BrochurePageItem = ({ page, index, onReplace, onDelete }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid h-22 grid-cols-[24px_44px_1fr_70px] items-center gap-4 rounded-2xl border bg-white py-3 pl-2 pr-4 ${
        isDragging ? "opacity-50" : ""
      } border-gomin-neutral-100`}
    >
      <GripVertical
        className="size-3.5 cursor-grab touch-none text-gomin-neutral-400"
        {...attributes}
        {...listeners}
      />

      <BrochureThumbnail
        file={page.file}
        previewUrl={page.previewUrl}
        index={index}
      />

      <div className="flex flex-col gap-0.5 overflow-hidden">
        <span className="text-[10px] font-medium uppercase tracking-widest text-gomin-primary-700">
          PAGE {String(index + 1).padStart(2, "0")}
        </span>
        <span className="truncate text-[13px] font-medium text-gomin-black">
          {page.file.name}
        </span>
        <span className="text-[11px] font-medium text-gomin-neutral-400">
          {formatFileSize(page.file.size)}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onReplace}
          className="flex size-8 items-center justify-center rounded-lg border border-gomin-neutral-100 bg-white"
          aria-label="교체"
        >
          <RefreshCw className="size-3.5 text-gomin-neutral-400" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex size-8 items-center justify-center rounded-lg border border-gomin-neutral-100 bg-white"
          aria-label="삭제"
        >
          <Trash2 className="size-3.5 text-gomin-neutral-400" />
        </button>
      </div>
    </div>
  );
};

export default BrochurePageItem;
