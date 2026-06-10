"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Check } from "lucide-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  Field,
  FieldTitle,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Mission } from "@/types";
import { stripInvisibleChars } from "@/utils";
import {
  MissionFormValues,
  MissionFormSchema,
} from "@/types/schemas/adminMissionSchemas";

type Props = {
  mission: Mission;
  onSave?: (mission: Mission) => Promise<void>;
};

const MissionDialog = ({ mission, onSave }: Props) => {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MissionFormValues>({
    resolver: standardSchemaResolver(MissionFormSchema),
    defaultValues: {
      title: mission.title,
      description: mission.description ?? "",
    },
  });

  const onSubmit = (values: MissionFormValues) => {
    startTransition(async () => {
      await onSave?.({ ...mission, ...values });
    });
  };

  return (
    <DialogContent className="sm:max-w-lg" showCloseButton={false}>
      <DialogHeader>
        <div className="flex items-start gap-4">
          <div>
            <DialogTitle className="text-xl font-bold text-gomin-black">
              {mission.id !== undefined ? "미션 수정" : "미션 추가"}
            </DialogTitle>
            <DialogDescription className="mt-1">
              {mission.id !== undefined
                ? "미션명과 설명을 수정할 수 있습니다."
                : "미션명과 설명을 입력해 주세요."}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="py-2 min-h-[220px]">
          <Field>
            <FieldTitle>
              미션명 <span className="text-red-500">*</span>
            </FieldTitle>
            <Input
              maxLength={20}
              placeholder="미션명을 입력해주세요. (최대 20자)"
              aria-invalid={!!errors.title}
              {...register("title", { setValueAs: stripInvisibleChars })}
            />
            <FieldError>{errors.title?.message}</FieldError>
          </Field>

          <Field>
            <FieldTitle>설명</FieldTitle>
            <Textarea
              rows={4}
              className="resize-none h-20"
              placeholder="미션 설명을 입력해주세요. (최대 500자)"
              maxLength={500}
              {...register("description", { setValueAs: stripInvisibleChars })}
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="default"
            className="bg-gomin-primary-700"
            disabled={isPending}
          >
            <Check />
            저장
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default MissionDialog;
