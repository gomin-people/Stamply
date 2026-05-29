import { useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import {
  useUploadAdminImageMutation,
  useDeleteAdminImageMutation,
} from "@/features/admin/upload/adminUploadMutations";

const MAX_PAGES = 10;

export type UploadPage = {
  id: string;
  file: File;
  previewUrl: string;
  url: string | null;
  path: string | null;
  isUploading: boolean;
};

const usePageUpload = () => {
  const [pages, setPages] = useState<UploadPage[]>([]);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replacingId = useRef<string | null>(null);

  const { mutate: uploadImage } = useUploadAdminImageMutation();
  const { mutate: deleteImage } = useDeleteAdminImageMutation();

  const uploadAndSet = (id: string, file: File) => {
    uploadImage(file, {
      onSuccess: ({ url, path }) => {
        setPages((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, url, path, isUploading: false } : p
          )
        );
      },
      onError: () => {
        setPages((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isUploading: false } : p))
        );
      },
    });
  };

  const addFiles = (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const remaining = MAX_PAGES - pages.length;
    const toAdd = fileArr.slice(0, remaining).map((file) => {
      const id = crypto.randomUUID();
      const page: UploadPage = {
        id,
        file,
        previewUrl: URL.createObjectURL(file),
        url: null,
        path: null,
        isUploading: true,
      };
      uploadAndSet(id, file);
      return page;
    });
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
    const id = replacingId.current;

    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (p.path) deleteImage(p.path);
        return {
          ...p,
          file,
          previewUrl: URL.createObjectURL(file),
          url: null,
          path: null,
          isUploading: true,
        };
      })
    );

    uploadAndSet(id, file);
    replacingId.current = null;
    e.target.value = "";
  };

  const handleDelete = (id: string) => {
    setPages((prev) => {
      const page = prev.find((p) => p.id === id);
      if (page?.path) deleteImage(page.path);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleReplace = (id: string) => {
    replacingId.current = id;
    replaceInputRef.current?.click();
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
    addFiles,
    replaceInputRef,
    handleUploadChange,
    handleAddChange,
    handleReplaceChange,
    handleDelete,
    handleReplace,
    handleDragEnd,
  };
};

export { MAX_PAGES };
export default usePageUpload;
