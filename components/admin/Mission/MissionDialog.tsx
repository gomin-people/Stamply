'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FieldGroup, Field, FieldTitle } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Mission } from '@/types/mission';

type Props = {
  mission: Mission;
  onSave?: (updated: Mission) => void;
};

export default function MissionDialog({ mission, onSave }: Props) {
  const [name, setName] = useState(mission.name);
  const [description, setDescription] = useState(mission.description);

  const handleSave = () => {
    onSave?.({ ...mission, name, description });
  };

  return (
    <DialogContent className="sm:max-w-lg" showCloseButton={false}>
      <DialogHeader>
        <div className="flex items-start gap-4">
          {mission.id !== undefined && (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gomin-primary-600 text-white text-lg font-bold">
              {mission.id}
            </div>
          )}
          <div>
            <p className="mb-1 text-xs font-medium text-gomin-primary-600">
              {mission.id !== undefined ? '미션 수정' : '미션 추가'}
            </p>
            <DialogTitle className="text-xl font-bold text-gomin-black">
              {mission.id !== undefined ? mission.name : '새 미션'}
            </DialogTitle>
            <DialogDescription className="mt-1">
              {mission.id !== undefined
                ? '미션명과 설명을 수정할 수 있습니다.'
                : '미션명과 설명을 입력해 주세요.'}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <FieldGroup className="py-2">
        <Field>
          <FieldTitle>
            미션명 <span className="text-red-500">*</span>
          </FieldTitle>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field>
          <FieldTitle>설명</FieldTitle>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </Field>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">취소</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant="default"
            className="bg-gomin-primary-700"
            onClick={handleSave}
          >
            <Check />
            변경사항 저장
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
