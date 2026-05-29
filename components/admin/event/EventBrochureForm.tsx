"use client";

import { forwardRef, useImperativeHandle } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVertical, Plus } from "lucide-react";
import BrochureDropzone from "./brochure/BrochureDropzone";
import BrochurePageItem from "./brochure/BrochurePageItem";
import useBrochurePages, { MAX_PAGES } from "@/hooks/useBrochurePages";
import { type StepFormHandle } from "@/types";

const EventBrochureForm = forwardRef<StepFormHandle>(function EventBrochureForm(_, ref) {
  useImperativeHandle(ref, () => ({
    validate: () => true,
    getData: () => ({}),
  }));
  const {
    pages,
    isDragOver,
    uploadInputRef,
    addInputRef,
    replaceInputRef,
    handleUploadChange,
    handleAddChange,
    handleReplaceChange,
    handleDelete,
    handleReplace,
    handleDropzoneDrop,
    handleDragEnd,
    setIsDragOver,
  } = useBrochurePages();

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="flex min-h-129 flex-col gap-2">
      <div className="pb-3">
        <BrochureDropzone
          isDragOver={isDragOver}
          onClick={() => uploadInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDropzoneDrop}
        />
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          multiple
          className="hidden"
          onChange={handleUploadChange}
        />
      </div>

      <div className="flex h-8 items-center justify-between">
        <span className="text-[11px] font-medium text-gomin-neutral-400">
          업로드된 페이지{" "}
          <span className="text-gomin-primary-700">{pages.length}</span> /{" "}
          {MAX_PAGES}
        </span>
        {pages.length > 0 && (
          <div className="flex items-center gap-1">
            <GripVertical className="size-3 text-gomin-neutral-400" />
            <span className="text-[11px] font-medium text-gomin-neutral-400">
              위·아래로 드래그해서 순서 변경
            </span>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pages.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {pages.map((page, index) => (
              <BrochurePageItem
                key={page.id}
                page={page}
                index={index}
                onReplace={() => handleReplace(page.id)}
                onDelete={() => handleDelete(page.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {pages.length < MAX_PAGES && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => addInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gomin-primary-300 py-4"
          >
            <Plus className="size-3.5 text-gomin-primary-700" />
            <span className="text-[12px] font-medium text-gomin-primary-700">
              페이지 추가
            </span>
          </button>
        </div>
      )}

      <input
        ref={addInputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        multiple
        className="hidden"
        onChange={handleAddChange}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={handleReplaceChange}
      />
    </div>
  );
});

export default EventBrochureForm;
