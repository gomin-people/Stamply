"use client";
import { memo, useRef, useState } from "react";
import { ImageIcon, X } from "lucide-react";
import {
  useUploadAdminImageMutation,
  useDeleteAdminImageMutation,
} from "@/features/admin/upload/adminUploadMutations";

import { cn } from "@/utils/index";
import { imageSchema } from "@/utils/schemas";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldTitle,
} from "@/components/ui/field";

type Props = {
  error?: string;
  initialImageUrl?: string;
  disabled?: boolean;
  onUploadStart: () => void;
  onUploadSuccess: (url: string) => void;
  onRemove: () => void;
};

const PosterImageField = memo(function PosterImageField({
  error,
  initialImageUrl,
  disabled,
  onUploadStart,
  onUploadSuccess,
  onRemove,
}: Props) {
  const [posterPreview, setPosterPreview] = useState<string | null>(
    initialImageUrl ?? null
  );
  const [posterPath, setPosterPath] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadImage, isPending: isUploading } =
    useUploadAdminImageMutation();
  const { mutate: deleteImage } = useDeleteAdminImageMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = imageSchema.safeParse(file);
    if (!result.success) {
      setFileError(result.error.issues[0]?.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFileError(undefined);
    setPosterPreview(URL.createObjectURL(file));
    onUploadStart();
    uploadImage(file, {
      onSuccess: ({ url, path }) => {
        setPosterPath(path);
        onUploadSuccess(url);
      },
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (posterPath) deleteImage(posterPath);
    setPosterPreview(null);
    setPosterPath(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onRemove();
  };

  return (
    <Field className="w-64 shrink-0" data-invalid={!!error}>
      <FieldTitle className="gap-1">
        포스터 이미지
        <span className="text-destructive">*</span>
      </FieldTitle>
      <div className="relative aspect-2/3 w-full">
        {posterPreview ? (
          <div className="relative h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterPreview}
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
            onClick={() => fileInputRef.current?.click()}
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
        <FieldError>{fileError ?? error}</FieldError>
      </div>
    </Field>
  );
});

export default PosterImageField;
