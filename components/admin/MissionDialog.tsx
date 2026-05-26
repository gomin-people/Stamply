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
import {
  FieldGroup,
  Field,
  FieldTitle,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Mission } from '@/types/mission';

type Props = {
  mission: Mission;
  onSave?: (updated: Mission) => void;
};

export default function MissionDialog({ mission, onSave }: Props) {
  const [title, setTitle] = useState(mission.title);
  const [description, setDescription] = useState(mission.description);
  const [titleError, setTitleError] = useState(false);
  const [saveing, setSaveing] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    onSave?.({ ...mission, title, description });
    setSaveing(true);
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
              {mission.id !== undefined ? mission.title : '새 미션'}
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
          <Input
            maxLength={20}
            value={title}
            aria-invalid={titleError}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError(false);
            }}
          />
          <FieldError>{titleError && '미션명을 입력해 주세요.'}</FieldError>
        </Field>

        <Field>
          <FieldTitle>설명</FieldTitle>
          <Textarea
            maxLength={500}
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
        <Button
          variant="default"
          className="bg-gomin-primary-700"
          onClick={handleSave}
          disabled={saveing}
        >
          <Check />
          저장
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
