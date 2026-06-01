"use client";

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
import BrochurePageItem from "./BrochurePageItem";
import type { UploadPage } from "@/hooks/usePageUpload";
import type { DragEndEvent } from "@dnd-kit/core";

type Props = {
  pages: UploadPage[];
  onReplace: (id: string) => void;
  onDelete: (id: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

const BrochurePageList = ({ pages, onReplace, onDelete, onDragEnd }: Props) => {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
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
              onReplace={() => onReplace(page.id)}
              onDelete={() => onDelete(page.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default BrochurePageList;
