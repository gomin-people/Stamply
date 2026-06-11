"use client";

import { memo, useRef, useEffect } from "react";
import { ImageIcon, X, Loader2 } from "lucide-react";
import useImageUpload from "@/hooks/useImageUpload";
import { cn } from "@/utils/index";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldTitle,
} from "@/components/ui/field";

const POSTER_ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
const POSTER_ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];

type Props = {
  value: string;
  error?: string;
  disabled?: boolean;
  onUploadingChange: (isUploading: boolean) => void;
  onChange: (url: string) => void;
  onRemove: () => void;
};

const PosterImageField = memo(function PosterImageField({
  value,
  error,
  disabled,

  onUploadingChange,
  onChange,
  onRemove,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isUploading,
    validationError,
    handleFileChange,
    handleRemove: handleImageRemove,
    triggerFileInput,
  } = useImageUpload({
    fileInputRef,
    initialPath: value,
    allowedMimeTypes: POSTER_ALLOWED_MIME_TYPES,
    allowedExtensions: POSTER_ALLOWED_EXTENSIONS,
    onUrlChange: (url) => {
      if (url) onChange(url);
    },
  });

  useEffect(() => {
    onUploadingChange(isUploading);
  }, [isUploading, onUploadingChange]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleImageRemove();
    onRemove();
  };

  return (
    <Field
      className="w-64 shrink-0"
      data-invalid={!!(error || validationError)}
    >
      <FieldTitle className="gap-1">
        포스터 이미지
        <span className="text-destructive">*</span>
      </FieldTitle>
      <div className="relative aspect-2/3 w-full">
        {isUploading ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary/60" />
            <span className="text-xs">업로드 중...</span>
          </div>
        ) : value ? (
          <div className="relative h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="포스터 미리보기"
              className="h-full w-full rounded-lg object-cover"
            />
            {!disabled && (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={handleRemove}
                className="absolute right-2 top-2 h-6 w-6 rounded-full bg-background/80 hover:bg-background shadow-md"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">삭제</span>
              </Button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isUploading || disabled}
            className={cn(
              "flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-50",
              error ? "border-destructive" : "border-input"
            )}
          >
            <ImageIcon className="size-8 text-primary/40" />
            <span className="text-xs">클릭해서 업로드해주세요.</span>
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpg,image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <FieldDescription className="text-xs">
        2 : 3 비율 · 1080 × 1620 권장
      </FieldDescription>
      <div className="h-3">
        <FieldError>{validationError ?? error}</FieldError>
      </div>
    </Field>
  );
});

export default PosterImageField;
