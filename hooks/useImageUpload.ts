"use client";

import { useState } from "react";
import {
  useUploadAdminImageMutation,
  useDeleteAdminImageMutation,
} from "@/features/admin/upload/adminUploadMutations";

const DEFAULT_ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
const DEFAULT_ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
const DEFAULT_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

type UseImageUploadOptions = {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  initialPath?: string | null;
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
  onUrlChange?: (url: string) => void;
};

export default function useImageUpload({
  fileInputRef,
  initialPath = null,
  allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS,
  allowedMimeTypes = DEFAULT_ALLOWED_MIME_TYPES,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
  onUrlChange,
}: UseImageUploadOptions) {
  const [path, setPath] = useState<string | null>(initialPath);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    mutate: uploadImage,
    isPending: isUploading,
    isSuccess,
    isError,
  } = useUploadAdminImageMutation();
  const { mutate: deleteImage } = useDeleteAdminImageMutation();

  const validate = (file: File): string | null => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (
      !allowedMimeTypes.includes(file.type) ||
      !ext ||
      !allowedExtensions.includes(ext)
    ) {
      return `지원하지 않는 파일 형식입니다. (${allowedExtensions.join(", ")} 이미지만 업로드 가능)`;
    }
    if (file.size > maxSizeBytes) {
      return `파일 크기는 ${Math.floor(maxSizeBytes / 1024 / 1024)}MB 이하여야 합니다.`;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validate(file);
    if (error) {
      setValidationError(error);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setValidationError(null);
    uploadImage(file, {
      onSuccess: ({ url, path: uploadedPath }) => {
        setPath(uploadedPath);
        onUrlChange?.(url);
      },
      onError: (err) => {
        console.error("이미지 업로드 에러:", err);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const handleRemove = () => {
    if (path) {
      deleteImage(path, {
        onError: (err) => console.error("이미지 삭제 에러:", err),
      });
    }
    setPath(null);
    setValidationError(null);
    onUrlChange?.("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return {
    isUploading,
    isSuccess,
    isError,
    validationError,
    handleFileChange,
    handleRemove,
    triggerFileInput,
  };
}
