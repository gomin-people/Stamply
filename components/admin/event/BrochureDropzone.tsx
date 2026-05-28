'use client';

import { Upload } from 'lucide-react';

type Props = {
  isDragOver: boolean;
  onClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
};

const BrochureDropzone = ({
  isDragOver,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop,
}: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex w-full items-center gap-4 rounded-2xl border border-dashed px-6 py-5 transition-colors ${
        isDragOver
          ? 'border-gomin-primary-700 bg-gomin-primary-100/50'
          : 'border-gomin-primary-300 bg-gomin-primary-100'
      }`}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_2px_3px_rgba(84,53,235,0.1)]">
        <Upload className="size-5 text-gomin-primary-700" />
      </div>
      <div className="flex flex-col gap-0.5 text-left">
        <span className="text-[13px] font-medium text-gomin-primary-600">
          여러 페이지를 한번에 업로드
        </span>
        <span className="text-[11px] font-medium text-gomin-primary-700">
          PDF · JPG · PNG 파일을 드래그하거나 클릭해 업로드하세요
        </span>
      </div>
      <div className="ml-auto shrink-0">
        <span className="rounded-xl bg-white px-3.5 py-2 text-[12px] font-medium text-gomin-primary-700">
          파일 선택
        </span>
      </div>
    </button>
  );
};

export default BrochureDropzone;
