import { useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";

const MAX_PAGES = 10;

export type UploadPage = {
  id: string;
  file: File;
  previewUrl: string;
};

const usePageUpload = () => {
  const [pages, setPages] = useState<UploadPage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replacingId = useRef<string | null>(null);

  const addFiles = (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const remaining = MAX_PAGES - pages.length;
    const toAdd = fileArr.slice(0, remaining).map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPages((prev) => [...prev, ...toAdd]);
  };

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleReplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !replacingId.current) return;
    const file = e.target.files[0];
    setPages((prev) =>
      prev.map((p) =>
        p.id === replacingId.current
          ? { ...p, file, previewUrl: URL.createObjectURL(file) }
          : p
      )
    );
    replacingId.current = null;
    e.target.value = "";
  };

  const handleDelete = (id: string) =>
    setPages((prev) => prev.filter((p) => p.id !== id));

  const handleReplace = (id: string) => {
    replacingId.current = id;
    replaceInputRef.current?.click();
  };

  const handleDropzoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPages((prev) => {
        const from = prev.findIndex((p) => p.id === active.id);
        const to = prev.findIndex((p) => p.id === over.id);
        return arrayMove(prev, from, to);
      });
    }
  };

  return {
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
  };
};

export { MAX_PAGES };
export default usePageUpload;
