"use client";

import { useRef } from "react";
import { Plus, X, Info } from "lucide-react";

type Props = {
  stampImage: string | null;
  onImageChange: (image: string | null) => void;
};

/**
 * 스탬프 업로드 UI + 핸들러 캡슐화 컴포넌트
 */
export default function StampUploadSection({
  stampImage,
  onImageChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 스탬프 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 MIME 타입 및 확장자 다중 검증 (허용: png, jpg, jpeg, webp)
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];
    const allowedExtensions = ["png", "jpg", "jpeg", "webp"];

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isValidMime = allowedMimeTypes.includes(file.type);
    const isValidExtension = fileExtension
      ? allowedExtensions.includes(fileExtension)
      : false;

    if (!isValidMime || !isValidExtension) {
      alert(
        "지원하지 않는 파일 형식입니다. (png, jpg, jpeg, webp 이미지만 업로드 가능)"
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      />

      {stampImage ? (
        <div className="relative w-[150px] h-[150px] rounded-2xl border border-gomin-neutral-200 bg-gomin-neutral-50 flex items-center justify-center p-4 group transition-all hover:shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stampImage}
            alt="스탬프 모양 미리보기"
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md border border-gomin-neutral-100 flex items-center justify-center text-gomin-neutral-500 hover:text-gomin-black hover:scale-105 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleUploadBoxClick}
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
      )}

      {/* 느낌표 안내 문구 */}
      <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-gomin-primary-100/50 border border-gomin-primary-100 text-gomin-primary-700/90 max-w-lg">
        <Info className="w-5 h-5 shrink-0" />
        <p className="text-xs font-bold leading-normal">
          스탬프 이미지를 따로 업로드하지 않으시면, 기본 제공되는 Stamply 스탬프
          이미지가 자동으로 사용됩니다.
        </p>
      </div>
    </div>
  );
}
