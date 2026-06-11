"use client";

import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  qrUrl: string;
  eventId: string;
  isSuccess?: boolean;
  onSuccessConfirm?: () => void;
};

const RewardQrModal = ({
  isOpen,
  onClose,
  qrUrl,
  eventId,
  isSuccess = false,
  onSuccessConfirm,
}: Props) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) =>
        !open && (isSuccess ? onSuccessConfirm?.() : onClose())
      }
    >
      <DialogContent
        showCloseButton={!isSuccess}
        className="sm:max-w-xs bg-white p-6 rounded-[24px] border border-gomin-primary-300 text-center flex flex-col items-center justify-center gap-4"
      >
        {isSuccess ? (
          <>
            {/* 체크 성공 아이콘 그래픽 */}
            <div className="w-16 h-16 bg-gomin-primary-100 rounded-full flex items-center justify-center mb-1">
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

            <div>
              <DialogTitle className="text-xl font-nanum font-extrabold text-gomin-black mb-2">
                리워드 수령 완료
              </DialogTitle>
              <DialogDescription className="text-sm font-nanum font-semibold text-gomin-neutral-500 mb-2 whitespace-pre-line">
                리워드 지급이 완료되었습니다.{"\n"}감사합니다!
              </DialogDescription>
            </div>

            <button
              type="button"
              onClick={onSuccessConfirm}
              className="w-full py-3.5 mt-2 rounded-[18px] font-nanum font-bold text-[16px] bg-gomin-primary-700 hover:bg-gomin-primary-600 text-white transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              확인
            </button>
          </>
        ) : (
          <>
            <div>
              <DialogTitle className="text-xl font-nanum font-extrabold text-gomin-black mb-1">
                리워드 수령 QR
              </DialogTitle>
              <DialogDescription className="text-sm font-nanum font-semibold text-gomin-neutral-500 whitespace-pre-line">
                스태프에게 이 QR을 보여주세요.{"\n"}스캔 후 리워드가 지급됩니다.
              </DialogDescription>
            </div>

            {qrUrl && (
              <div className="rounded-2xl border border-gomin-neutral-100 bg-white p-5 shadow-sm">
                <QRCode
                  value={qrUrl}
                  size={200}
                  aria-label={`리워드 수령 QR (행사 ${eventId})`}
                />
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RewardQrModal;
