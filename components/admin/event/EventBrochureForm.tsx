"use client";

import { forwardRef, useImperativeHandle } from "react";
import BrochureDropzone from "./brochure/BrochureDropzone";
import BrochurePageStatus from "./brochure/BrochurePageStatus";
import BrochurePageList from "./brochure/BrochurePageList";
import BrochureAddButton from "./brochure/BrochureAddButton";
import usePageUpload, { MAX_PAGES } from "@/hooks/usePageUpload";
import { type StepFormHandle } from "@/types";

type Props = {
  initialData?: { brochureImageUrl?: string[] };
  disabled?: boolean;
};

const EventBrochureForm = forwardRef<StepFormHandle, Props>(
  function EventBrochureForm({ disabled = false }, ref) {
    const {
      pages,
      addFiles,
      replaceInputRef,
      handleUploadChange,
      handleAddChange,
      handleReplaceChange,
      handleDelete,
      handleReplace,
      handleDragEnd,
    } = usePageUpload();

    useImperativeHandle(
      ref,
      () => ({
        validate: () => true,
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
          <BrochureAddButton onChange={handleAddChange} />
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
