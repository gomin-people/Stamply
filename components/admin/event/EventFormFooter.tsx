"use client";

import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

type Mode = "view" | "edit";

type EventFormFooterProps = {
  disabled?: boolean;
  mode?: Mode;
  onEditStart?: () => void;
  onEditCancel?: () => void;
  onEditSave?: () => void;
  onDeleteClick?: () => void;
};

const outlineButton =
  "gap-1.5 rounded-xl border-gomin-neutral-200 px-5.5 py-3 text-sm font-medium text-gomin-neutral-500 transition-transform hover:-translate-y-0.5 active:translate-y-0";

const primaryButton =
  "gap-1.5 rounded-xl bg-gomin-primary-700 bg-clip-border px-5.5 py-3 text-sm font-medium shadow-[0px_6px_16px_-6px_rgba(84,53,235,0.6)] transition-all hover:-translate-y-0.5 hover:bg-gomin-primary-700/90 hover:shadow-[0px_8px_20px_-6px_rgba(84,53,235,0.7)] active:translate-y-0";

const EventFormFooter = ({
  disabled = false,
  mode,
  onEditStart,
  onEditCancel,
  onEditSave,
  onDeleteClick,
}: EventFormFooterProps) => {
  return (
    <div className="flex h-20 items-center justify-end gap-2 border-t border-gomin-neutral-100 pt-4">
      {mode === "view" && onDeleteClick && (
        <Button
          type="button"
          variant="outline"
          size={null}
          className={outlineButton}
          onClick={onDeleteClick}
        >
          삭제하기
        </Button>
      )}

      {mode === "view" && onEditStart && (
        <Button
          type="button"
          variant="outline"
          size={null}
          className={cn(
            outlineButton,
            "border-gomin-primary-300 text-gomin-primary-700 hover:text-gomin-primary-700"
          )}
          onClick={onEditStart}
        >
          수정하기
        </Button>
      )}

      {mode === "edit" && (
        <>
          <Button
            type="button"
            variant="outline"
            size={null}
            className={outlineButton}
            onClick={onEditCancel}
          >
            <X className="size-3.5" />
            변경 취소
          </Button>
          <Button
            type="button"
            size={null}
            className={primaryButton}
            disabled={disabled}
            onClick={onEditSave}
          >
            <Save className="size-3.5" />
            변경사항 저장
          </Button>
        </>
      )}
    </div>
  );
};

export default EventFormFooter;
