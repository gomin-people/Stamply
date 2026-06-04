"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download } from "lucide-react";
import QRCode from "react-qr-code";
import type { AdminMissionDetail } from "@/types/models/admin";
import { getMissionCheckUrl } from "@/utils/qr";

type Props = {
  missions: AdminMissionDetail[];
  disabled?: boolean;
};

const QR_SIZE = 256;

function svgToPng(svgElement: SVGElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const svgStr = new XMLSerializer().serializeToString(svgElement);
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
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG 변환 실패"));
    };
    img.src = url;
  });
}

export default function QRDownloadButton({
  missions,
  disabled = false,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasQRCodes = missions.some((m) => m.qrCodes && m.qrCodes.length > 0);

  const handleDownload = async () => {
    if (!containerRef.current) return;
    setIsDownloading(true);

    const targets: { token: string; filename: string }[] = missions.flatMap(
      (mission) =>
        (mission.qrCodes ?? []).map((qr) => ({
          token: qr.token,
          filename: `${mission.title}_${qr.id}.png`,
        }))
    );

    for (let i = 0; i < targets.length; i++) {
      const { token, filename } = targets[i];
      const wrapper = containerRef.current.querySelector<HTMLDivElement>(
        `[data-token="${token}"]`
      );
      const svgEl = wrapper?.querySelector("svg");
      if (!svgEl) continue;

      const dataUrl = await svgToPng(svgEl);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      a.click();

      if (i < targets.length - 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    setIsDownloading(false);
  };

  return (
    <>
      <div ref={containerRef} className="hidden" aria-hidden>
        {missions.flatMap((mission) =>
          (mission.qrCodes ?? []).map((qr) => (
            <div key={qr.id} data-token={qr.token}>
              <QRCode value={getMissionCheckUrl(qr.token)} size={QR_SIZE} />
            </div>
          ))
        )}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={disabled ? 0 : undefined}>
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloading || !hasQRCodes || disabled}
            >
              <Download />
              {isDownloading ? "다운로드 중..." : "QR 일괄 다운로드"}
            </Button>
          </span>
        </TooltipTrigger>
        {disabled && (
          <TooltipContent>
            종료된 행사의 QR은 다운로드할 수 없습니다
          </TooltipContent>
        )}
      </Tooltip>
    </>
  );
}
