"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";

type AddProps = {
  onChange: React.ComponentProps<"input">["onChange"];
};

const BrochureAddButton = ({ onChange }: AddProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gomin-primary-300 py-4"
      >
        <Plus className="size-3.5 text-gomin-primary-700" />
        <span className="text-[15px] font-medium text-gomin-primary-700">
          페이지 추가
        </span>
      </button>
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

export default BrochureAddButton;
