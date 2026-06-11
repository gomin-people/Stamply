"use client";

import { useRef, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import InfoBanner from "@/components/admin/event/themeStamp/InfoBanner";
import useImageUpload from "@/hooks/useImageUpload";

type Props = {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  onUploadingChange: (isUploading: boolean) => void;
  disabled?: boolean;
};

const StampUploadSection = ({
  value,
  onChange,
  onRemove,
  onUploadingChange,
  disabled = false,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isUploading,
    validationError,
    handleFileChange,
    handleRemove,
    triggerFileInput,
  } = useImageUpload({
    fileInputRef,
    onUrlChange: (url) => {
      onChange(url);
    },
  });

  useEffect(() => {
    onUploadingChange(isUploading);
  }, [isUploading, onUploadingChange]);

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleRemove();
    onRemove();
  };

  return (
    <div className="space-y-3 text-gomin-black">
      <h3 className="text-base font-bold text-gomin-neutral-700">
        스탬프 모양
      </h3>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="w-[150px] h-[150px] rounded-2xl border border-gomin-neutral-200 flex flex-col items-center justify-center gap-1.5">
          <Loader2 className="w-5 h-5 animate-spin text-gomin-primary-600" />
          <span className="text-[10px] font-bold text-gomin-neutral-700">
            업로드 중
          </span>
        </div>
      ) : value ? (
        <div className="relative w-[150px] h-[150px] rounded-2xl border border-gomin-neutral-200 flex items-center justify-center p-4 group transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-checkerboard rounded-2xl overflow-hidden z-0" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="스탬프 모양 미리보기"
            className="w-full h-full object-contain relative z-10"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md border border-gomin-neutral-100 flex items-center justify-center text-gomin-neutral-500 hover:text-gomin-black hover:scale-105 transition-all cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : !disabled ? (
        <div
          onClick={triggerFileInput}
          className="w-[150px] h-[150px] rounded-2xl border-2 border-dashed border-gomin-neutral-200 bg-gomin-neutral-50/50 hover:bg-gomin-neutral-50 hover:border-gomin-neutral-300 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all p-3 text-center select-none"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-gomin-neutral-100 shadow-sm flex items-center justify-center text-gomin-neutral-400">
            <Plus className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[13px] font-extrabold text-gomin-neutral-600">
              스탬프 이미지 업로드
            </p>
            <p className="text-[10px] font-bold text-gomin-neutral-400 leading-normal">
              1:1 비율 권장
              <br />
              투명 배경 PNG
            </p>
          </div>
        </div>
      ) : null}

      {validationError && (
        <p className="text-xs text-destructive">{validationError}</p>
      )}

      <InfoBanner message="스탬프 이미지를 따로 업로드하지 않으시면, 기본 제공되는 Stamplo 스탬프 이미지가 자동으로 사용됩니다." />
    </div>
  );
};

export default StampUploadSection;
