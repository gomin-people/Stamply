import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
export default function QRDownloadButton() {
  return (
    <>
      <Button variant="outline">
        <Download />
        QR 일괄 다운로드
      </Button>
    </>
  );
}
