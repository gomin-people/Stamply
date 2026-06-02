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

const EventEditCancelDialog = ({ onConfirm }: Props) => {
  return (
    <DialogContent className="sm:max-w-lg" showCloseButton={false}>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-gomin-black mt-3">
          변경사항을 취소하시겠습니까?
        </DialogTitle>
        <DialogDescription className="mt-1">
          저장하지 않은 변경사항은 모두 사라집니다.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">계속 수정하기</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="default"
            className="bg-gomin-primary-700"
            onClick={onConfirm}
          >
            변경 취소
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default EventEditCancelDialog;
