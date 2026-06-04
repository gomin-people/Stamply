"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Button from "@/components/sample/Button";
import { useModalHistoryBack } from "@/hooks/useModalHistoryBack";

type Mission = {
  id: number;
  title: string;
  description: string;
  isStamped: boolean;
};

type MissionDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
};

export default function MissionDetailModal({
  isOpen,
  onClose,
  mission,
}: MissionDetailModalProps) {
  useModalHistoryBack(isOpen, onClose);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <span className="inline-block self-start px-2.5 py-0.5 text-xs font-semibold text-gomin-primary-700 bg-gomin-primary-100 rounded-full w-fit mb-1">
            미션 정보
          </span>
          <DialogTitle className="font-extrabold text-xl text-gomin-black">
            {mission.title}
          </DialogTitle>
          <DialogDescription className="text-gomin-neutral-500 text-sm mt-1 leading-relaxed">
            {mission.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 p-1">
          <div className="flex items-center gap-2 mt-2 p-3 bg-gomin-neutral-100 rounded-xl">
            <span className="text-lg">{mission.isStamped ? "🎉" : "🔒"}</span>
            <span className="text-sm font-semibold text-gomin-neutral-700">
              {mission.isStamped
                ? "이미 완료된 미션입니다!"
                : "아직 미완료된 미션입니다. QR코드를 스캔해 보세요!"}
            </span>
          </div>

          <Button
            className="mt-3 w-full py-3.5 rounded-xl font-bold bg-gomin-primary-700 hover:bg-gomin-primary-600 text-white transition-all active:scale-[0.98]"
            onClick={onClose}
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
