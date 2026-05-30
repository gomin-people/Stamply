"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type AddProps = {
  onChange: React.ComponentProps<"input">["onChange"];
};

const BrochureAddButton = ({ onChange }: AddProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="pt-1">
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="h-auto w-full gap-1.5 rounded-2xl border-dashed border-gomin-primary-300 py-4"
      >
        <Plus className="size-3.5 text-gomin-primary-700" />
        <span className="text-[15px] font-medium text-gomin-primary-700">
          페이지 추가
        </span>
      </Button>
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
