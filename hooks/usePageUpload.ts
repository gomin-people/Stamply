import { useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { toast } from "sonner";
import {
  useUploadAdminImageMutation,
  useDeleteAdminImageMutation,
} from "@/features/admin/upload/adminUploadMutations";

const MAX_PAGES = 10;

export type UploadPage = {
  id: string;
  file: File;
  previewUrl: string; // blob URL (미리보기용)
  url: string | null; // Storage 업로드 완료 후 URL
  path: string | null; // Storage 경로 (삭제 시 사용)
  isUploading: boolean;
};

const usePageUpload = () => {
  const [pages, setPages] = useState<UploadPage[]>([]);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replacingId = useRef<string | null>(null); // 교체 중인 페이지 id

  const { mutate: uploadImage } = useUploadAdminImageMutation();
  const { mutate: deleteImage } = useDeleteAdminImageMutation();

  // Storage 업로드 후 해당 페이지의 url/path 갱신
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

  // 파일 배열을 받아 MAX_PAGES 범위 내에서 페이지 추가 후 즉시 업로드
  // 드래그 드롭/추가 버튼 초과 시 토스트 — 드롭존 클릭 차단은 BrochureDropzone에서 별도 처리
  const addFiles = (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const remaining = MAX_PAGES - pages.length;
    if (fileArr.length > remaining) {
      toast.warning(`최대 ${MAX_PAGES}페이지까지 업로드할 수 있어요.`);
    }
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

  // 기존 파일을 새 파일로 교체: 기존 Storage 파일 삭제 후 새 파일 업로드
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

  // 페이지 삭제: Storage 파일도 함께 제거
  const handleDelete = (id: string) => {
    setPages((prev) => {
      const page = prev.find((p) => p.id === id);
      if (page?.path) deleteImage(page.path);
      return prev.filter((p) => p.id !== id);
    });
  };

  // 교체할 페이지 id를 기록하고 파일 선택 input 트리거
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
