"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/utils";

type DropzoneProps = {
  onChange: React.ComponentProps<"input">["onChange"];
  onDrop: (files: FileList) => void;
  isFull?: boolean;
  disabled?: boolean;
};

const MESSAGES = {
  full: "최대 10페이지까지 업로드할 수 있어요.",
  invalidType: "JPG, PNG 파일만 업로드할 수 있어요.",
};

const BrochureDropzone = ({
  onChange,
  onDrop,
  isFull = false,
  disabled = false,
}: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [shake, setShake] = useState(0);

  const triggerShake = (message: string) => {
    toast.warning(message, { id: "brochure-warning" });
    setShake((s) => s + 1);
  };

  // ui 검증 레벨이라 여기 있는게 나음. 훅은 파일을 받아서 상태/업로드 처리만 하고, 어떤 파일을 받을지는 컴포넌트에서 결정하는 게 자연스러움.
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || !e.dataTransfer.files) return;
    if (isFull) return triggerShake(MESSAGES.full);
    const allowed = Array.from(e.dataTransfer.files).filter((f) =>
      ["image/jpeg", "image/png"].includes(f.type)
    );
    if (allowed.length === 0) return triggerShake(MESSAGES.invalidType);
    const dt = new DataTransfer();
    allowed.forEach((f) => dt.items.add(f));
    onDrop(dt.files);
  };

  const handleClick = () => {
    if (disabled) return;
    if (isFull) return triggerShake(MESSAGES.full);
    inputRef.current?.click();
  };

  return (
    <div className="pb-3">
      <motion.div
        key={shake}
        animate={shake > 0 ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <button
          type="button"
          onClick={handleClick}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex w-full items-center gap-4 rounded-2xl border border-dashed px-6 py-5 transition-colors",
            disabled
              ? "cursor-not-allowed border-gomin-neutral-200 bg-gomin-neutral-50"
              : isDragOver
                ? "cursor-copy border-gomin-primary-700 bg-gomin-primary-100/50"
                : "cursor-pointer border-gomin-primary-300 bg-gomin-primary-100"
          )}
        >
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_2px_3px_rgba(84,53,235,0.1)]",
              disabled && "shadow-none"
            )}
          >
            <Upload
              className={cn(
                "size-5",
                disabled ? "text-gomin-neutral-300" : "text-gomin-primary-700"
              )}
            />
          </div>
          <div className="flex flex-col gap-0.5 text-left">
            <span
              className={cn(
                "text-[15px] font-medium",
                disabled ? "text-gomin-neutral-300" : "text-gomin-primary-600"
              )}
            >
              여러 페이지를 한번에 업로드
            </span>
            <span
              className={cn(
                "text-[13px] font-medium",
                disabled ? "text-gomin-neutral-300" : "text-gomin-primary-700"
              )}
            >
              JPG · PNG 파일을 드래그하거나 클릭해 업로드하세요
            </span>
          </div>
          <div className="ml-auto shrink-0">
            <span
              className={cn(
                "rounded-xl bg-white px-3.5 py-2 text-[13px] font-medium",
                disabled ? "text-gomin-neutral-300" : "text-gomin-primary-700"
              )}
            >
              파일 선택
            </span>
          </div>
        </button>
      </motion.div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
};

export default BrochureDropzone;
