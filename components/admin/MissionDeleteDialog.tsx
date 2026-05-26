import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mission } from '@/types/mission';
import { useState } from 'react';

type Props = {
  mission: Mission;
  onDelete?: (id: number) => void;
};

export default function MissionDeleteDialog({ mission, onDelete }: Props) {
  const [saveing, setSaveing] = useState(false);

  const handlerDelete = () => {
    setSaveing(true);
    mission.id && onDelete?.(mission.id);
  };

  return (
    <DialogContent className="sm:max-w-lg" showCloseButton={false}>
      <DialogHeader>
        <p className="mb-1 text-xs font-medium text-gomin-primary-600">
          미션 삭제
        </p>
        <DialogTitle className="text-xl font-bold text-gomin-black">
          &quot;{mission.title}&quot;를 삭제하시겠습니까?
        </DialogTitle>
        <DialogDescription className="mt-1"></DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">취소</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="default"
            className="bg-gomin-primary-700"
            onClick={handlerDelete}
            disabled={saveing}
          >
            삭제하기
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
