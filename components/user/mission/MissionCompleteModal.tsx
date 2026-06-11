"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MissionCompleteModal = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-xs bg-white p-6 rounded-[24px] border border-gomin-primary-300 text-center flex flex-col items-center justify-center"
      >
        {/* 체크 성공 아이콘 그래픽 */}
        <div className="w-16 h-16 bg-gomin-primary-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gomin-primary-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <DialogTitle className="text-xl font-nanum font-extrabold text-gomin-black mb-2">
          미션완료
        </DialogTitle>
        <DialogDescription className="text-sm font-nanum font-semibold text-gomin-neutral-500 mb-6 whitespace-pre-line">
          리워드 지급이 완료되었습니다.{"\n"}감사합니다!
        </DialogDescription>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-[18px] font-nanum font-bold text-[16px] bg-gomin-primary-700 hover:bg-gomin-primary-600 text-white transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          확인
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default MissionCompleteModal;
