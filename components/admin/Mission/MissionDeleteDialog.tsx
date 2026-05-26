import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  id: number;
  onDelete?: () => void;
};

export default function MissionDeleteDialog({ id, onDelete }: Props) {
  return (
    <DialogContent className="sm:max-w-sm" showCloseButton={false}>
      <DialogHeader>
        <p className="mb-1 text-xs font-medium text-gomin-primary-600">
          미션 삭제
        </p>
        <DialogTitle className="text-xl font-bold text-gomin-black">
          미션 #{id}를 삭제하시겠습니까?
        </DialogTitle>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">취소</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="default"
            className="bg-gomin-primary-700"
            onClick={onDelete}
          >
            삭제하기
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
