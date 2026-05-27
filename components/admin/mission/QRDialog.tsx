'use client';

import { useRef } from 'react';
import { Download, Printer, QrCode } from 'lucide-react';
import { getMissionCheckUrl } from '@/utils/qr';
import QRCode from 'react-qr-code';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  missionTitle: string;
  token: string;
  qrId: number;
};

const QR_SIZE = 240;

export default function QRDialog({ missionTitle, token, qrId }: Props) {
  const svgRef = useRef<HTMLDivElement>(null);
  const qrCodeUrl = getMissionCheckUrl(token);

  const handleDownload = () => {
    const svgEl = svgRef.current?.querySelector('svg');
    if (!svgEl) return;

    const svgStr = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = QR_SIZE;
      canvas.height = QR_SIZE;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, QR_SIZE, QR_SIZE);
      ctx.drawImage(img, 0, 0, QR_SIZE, QR_SIZE);
      URL.revokeObjectURL(url);

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${missionTitle}_${qrId}.png`;
      a.click();
    };

    img.src = url;
  };

  const handlePrint = () => {
    const svgEl = svgRef.current?.querySelector('svg');
    if (!svgEl) return;

    const svgStr = new XMLSerializer().serializeToString(svgEl);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${missionTitle} QR 코드</title>
          <style>
            body {
              margin: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: sans-serif;
              gap: 16px;
            }
            p { margin: 0; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <p>${missionTitle}</p>
          ${svgStr}
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gomin-primary-600 text-white">
            <QrCode className="size-6" />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-gomin-primary-600">
              QR 코드
            </p>
            <DialogTitle className="text-xl font-bold text-gomin-black">
              {missionTitle}
            </DialogTitle>
            <DialogDescription className="mt-1">
              QR 코드를 스캔하여 미션을 진행하세요.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex justify-center py-4">
        <div
          ref={svgRef}
          className="rounded-2xl border border-gomin-neutral-100 bg-white p-5 shadow-sm"
        >
          {qrCodeUrl && <QRCode value={qrCodeUrl} size={QR_SIZE} />}
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-2">
        <Button variant="outline" className="flex-1" onClick={handlePrint}>
          <Printer />
          프린트
        </Button>
        <Button
          className="flex-1 bg-gomin-primary-700"
          onClick={handleDownload}
        >
          <Download />
          다운로드
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
