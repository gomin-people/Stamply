"use client";

import { useRef, useState } from "react";
import {
  useUploadAdminImageMutation,
  useDeleteAdminImageMutation,
} from "@/features/admin/upload/adminUploadMutations";

type UseStampUploadParams = {
  onPreviewChange: (url: string | null) => void;
  onFileUrlChange: (url: string | null) => void;
  onUploadingChange: (isUploading: boolean) => void;
};

/**
 * 스탬프 업로드 비즈니스 로직(MIME/확장자 검증, Storage API 호출, 예외 처리)을 관리하는 커스텀 훅
 */
export default function useStampUpload({
  onPreviewChange,
  onFileUrlChange,
  onUploadingChange,
}: UseStampUploadParams) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stampPath, setStampPath] = useState<string | null>(null);

  const { mutate: uploadImage, isPending: isUploading } =
    useUploadAdminImageMutation();
  const { mutate: deleteImage } = useDeleteAdminImageMutation();

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

    // 1. 모바일 라이브 미리보기를 위해 로컬 Blob URL을 즉시 갱신 (지연 제거 UX)
    const localBlobUrl = URL.createObjectURL(file);
    onPreviewChange(localBlobUrl);
    onUploadingChange(true);

    // 2. 백그라운드에서 Supabase Storage 업로드 mutation 실행
    uploadImage(file, {
      onSuccess: ({ url, path }: { url: string; path: string }) => {
        setStampPath(path);
        onFileUrlChange(url);
        onUploadingChange(false);
      },
      onError: (err: unknown) => {
        console.error("스탬프 업로드 에러:", err);
        alert("스탬프 이미지 업로드에 실패했습니다.");
        onPreviewChange(null);
        onFileUrlChange(null);
        onUploadingChange(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  const handleUploadBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Storage에 존재하는 파일일 경우 백그라운드 삭제 API 호출
    if (stampPath) {
      deleteImage(stampPath, {
        onError: (err: unknown) => {
          console.error("스탬프 삭제 에러:", err);
        },
      });
    }

    setStampPath(null);
    onPreviewChange(null);
    onFileUrlChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    fileInputRef,
    isUploading,
    handleFileChange,
    handleRemoveImage,
    handleUploadBoxClick,
  };
}
