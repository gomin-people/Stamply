"use client";

import { useRef } from "react";
import { Download, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { getEntryQrUrl } from "@/utils/qr";

type Props = {
  token: string;
  qrId: number;
};

const QR_SIZE = 240;

const EntryQrCard = ({ token, qrId }: Props) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const qrUrl = getEntryQrUrl(token);

  const handleDownload = () => {
    const svgEl = svgRef.current?.querySelector("svg");
    if (!svgEl) return;

    const svgStr = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = QR_SIZE;
      canvas.height = QR_SIZE;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, QR_SIZE, QR_SIZE);
      ctx.drawImage(img, 0, 0, QR_SIZE, QR_SIZE);
      URL.revokeObjectURL(url);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `entry_qr_${qrId}.png`;
      a.click();
    };

    img.src = url;
  };

  return (
    <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-gomin-primary-200 bg-linear-to-br from-[#f3f1fe] to-[#ece6fe] px-6 py-4">
      <div className="relative shrink-0">
        <div className="flex size-14 items-center justify-center rounded-xl bg-white shadow-[0px_4px_12px_-4px_rgba(84,53,235,0.25)]">
          <div ref={svgRef} className="hidden">
            <QRCode value={qrUrl} size={QR_SIZE} />
          </div>
          <QrCode className="size-10 text-gomin-primary-600" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gomin-black">
            행사 입장 QR 코드
          </span>
          <span className="rounded-full bg-gomin-primary-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-white">
            Entry
          </span>
        </div>
        <p className="text-[13px] text-gomin-neutral-500">
          참여자는 이 QR을 스캔해 행사에 입장합니다. 인쇄용 PNG · PDF로
          다운로드하세요.
        </p>
      </div>

      <Button
        size={null}
        className="relative shrink-0 gap-1.5 rounded-xl bg-gomin-primary-700 bg-clip-border px-5 py-2.5 text-[14px] font-medium shadow-[0px_6px_16px_-6px_rgba(84,53,235,0.6)] transition-all hover:-translate-y-0.5 hover:bg-gomin-primary-700/90 hover:shadow-[0px_8px_20px_-6px_rgba(84,53,235,0.7)] active:translate-y-0"
        onClick={handleDownload}
      >
        <Download className="size-3.5" />
        QR 다운로드
      </Button>
    </div>
  );
};

export default EntryQrCard;
