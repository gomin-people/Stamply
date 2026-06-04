import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  onConfirm: () => void;
};

const EventDeleteDialog = ({ onConfirm }: Props) => {
  return (
    <DialogContent className="sm:max-w-lg" showCloseButton={false}>
      <DialogHeader>
        <p className="mb-1 text-xs font-semibold text-red-500">히든 루트~!</p>
        <DialogTitle className="text-xl font-bold text-gomin-black">
          행사를 삭제하시겠습니까?
        </DialogTitle>
        <DialogDescription className="mt-1">
          삭제된 행사와 관련 데이터(미션, QR, 참여자 기록)는 복구할 수 없습니다.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">취소</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" onClick={onConfirm}>
            삭제하기
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default EventDeleteDialog;
