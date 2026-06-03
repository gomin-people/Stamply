"use client";

import { forwardRef, useImperativeHandle } from "react";
import BrochureDropzone from "./brochure/BrochureDropzone";
import BrochurePageStatus from "./brochure/BrochurePageStatus";
import BrochurePageList from "./brochure/BrochurePageList";
import BrochureAddButton from "./brochure/BrochureAddButton";
import usePageUpload, { MAX_PAGES } from "@/hooks/usePageUpload";
import { type StepFormHandle } from "@/types";
import { toast } from "sonner";

type Props = {
  initialData?: { brochureImageUrl?: string[] };
  disabled?: boolean;
};

const EventBrochureForm = forwardRef<StepFormHandle, Props>(
  function EventBrochureForm({ initialData, disabled = false }, ref) {
    const {
      pages,
      addFiles,
      replaceInputRef,
      handleUploadChange,
      handleReplaceChange,
      handleDelete,
      handleReplace,
      handleDragEnd,
    } = usePageUpload(initialData?.brochureImageUrl);

    useImperativeHandle(
      ref,
      () => ({
        validate: () => {
          if (pages.some((p) => p.isUploading)) {
            toast.warning("이미지 업로드가 완료될 때까지 기다려주세요.");
            return false;
          }
          return true;
        },
        getData: () => ({
          brochureImageUrl: pages
            .filter((p) => p.url !== null)
            .map((p) => p.url as string),
        }),
      }),
      [pages]
    );

    return (
      <div className="flex min-h-166 flex-col gap-2">
        <BrochureDropzone
          onChange={handleUploadChange}
          onDrop={addFiles}
          isFull={pages.length >= MAX_PAGES}
          disabled={disabled}
        />

        <BrochurePageStatus count={pages.length} />

        <BrochurePageList
          pages={pages}
          onReplace={handleReplace}
          onDelete={handleDelete}
          onDragEnd={handleDragEnd}
          disabled={disabled}
        />

        {pages.length < MAX_PAGES && !disabled && (
          <BrochureAddButton onChange={handleUploadChange} />
        )}

        <input
          ref={replaceInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleReplaceChange}
        />
      </div>
    );
  }
);

export default EventBrochureForm;
