"use client";

import { useRef, useState } from "react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download } from "lucide-react";
import QRCode from "react-qr-code";
import type { AdminMissionDetail } from "@/types/models/admin";
import { getMissionCheckUrl, svgToPng } from "@/utils/qr";

type Props = {
  missions: AdminMissionDetail[];
  disabled?: boolean;
};

const QR_SIZE = 256;
const QR_PADDING = 16;

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

    const zip = new JSZip();

    const targets = missions.flatMap((mission) =>
      (mission.qrCodes ?? []).map((qr) => ({
        token: qr.token,
        filename: `${mission.title}_${qr.id}.png`,
      }))
    );

    for (const { token, filename } of targets) {
      const wrapper = containerRef.current.querySelector<HTMLDivElement>(
        `[data-token="${token}"]`
      );
      const svgEl = wrapper?.querySelector("svg");
      if (!svgEl) continue;

      const dataUrl = await svgToPng(svgEl, QR_SIZE, QR_PADDING);
      const base64 = dataUrl.split(",")[1];
      zip.file(filename, base64, { base64: true });
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mission_qr_codes.zip";
    a.click();
    URL.revokeObjectURL(url);

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
