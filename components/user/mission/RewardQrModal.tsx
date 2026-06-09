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
  onClose: (open: boolean) => void;
  qrUrl: string;
  eventId: string;
};

const RewardQrModal = ({ isOpen, onClose, qrUrl, eventId }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton
        className="sm:max-w-xs bg-white p-6 rounded-[24px] border border-gomin-primary-300 text-center flex flex-col items-center justify-center gap-4"
      >
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
      </DialogContent>
    </Dialog>
  );
};

export default RewardQrModal;
