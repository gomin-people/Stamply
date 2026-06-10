import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mission } from "@/types";
import { useState } from "react";

type Props = {
  mission: Mission;
  onDelete?: (id: number) => void;
};

export default function MissionDeleteDialog({ mission, onDelete }: Props) {
  const [saving, setSaving] = useState(false);

  const handleDelete = () => {
    setSaving(true);
    if (mission.id) {
      onDelete?.(mission.id);
    }
  };

  return (
    <DialogContent className="sm:max-w-lg" showCloseButton={false}>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-gomin-black">
          미션 삭제
        </DialogTitle>
        <DialogDescription className="mt-1">
          &quot;{mission.title}&quot;를 삭제하시겠습니까?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">취소</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="default"
            className="bg-gomin-primary-700"
            onClick={handleDelete}
            disabled={saving}
          >
            삭제하기
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
