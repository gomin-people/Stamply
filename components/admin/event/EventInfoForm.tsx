"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { MapPin, Mail } from "lucide-react";
import { type StepFormHandle } from "@/types";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CharCount from "@/components/admin/common/CharCount";
import PosterImageField from "@/components/admin/event/info/PosterImageField";
import EventContactPhoneField from "@/components/admin/event/info/EventContactPhoneField";
import { stripInvisibleChars } from "@/utils";
import { EventInfoSchema } from "@/types/schemas/adminEventInfoSchemas";
import { toast } from "sonner";

type FormState = z.infer<typeof EventInfoSchema>;

type DisabledField = keyof FormState;

type Props = {
  initialData?: Partial<FormState>;
  disabledFields?: "all" | DisabledField[];
};

const defaultForm: FormState = {
  title: "",
  startDate: "",
  endDate: "",
  location: "",
  locationUrl: "",
  production: "",
  contactPhone: "",
  contactEmail: "",
  startTime: "",
  endTime: "",
  operatingRemarks: "",
  posterImageUrl: "",
};

const buildDefaultValues = (initialData?: Partial<FormState>): FormState => ({
  ...defaultForm,
  ...Object.fromEntries(
    Object.entries(initialData ?? {}).filter(([, v]) => v !== undefined)
  ),
});

const handleSetValueAs = (v: string) => stripInvisibleChars(v).trim();

const EventInfoForm = forwardRef<StepFormHandle, Props>(function EventInfoForm(
  { initialData, disabledFields },
  ref
) {
  const isDisabled = (field: DisabledField) =>
    disabledFields === "all" ||
    (Array.isArray(disabledFields) && disabledFields.includes(field));

  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: buildDefaultValues(initialData),
    resolver: standardSchemaResolver(EventInfoSchema),
    mode: "onChange",
  });

  useImperativeHandle(
    ref,
    () => ({
      // safeParse로 동기 반환값 확보, void trigger()로 formState.errors 비동기 업데이트
      validate: () => {
        if (isUploading) {
          toast.warning(
            "행사 대표 이미지가 스토리지에 업로드 중입니다. 잠시만 기다려주세요.",
            { id: "uploading" }
          );
          return false;
        }
        const result = EventInfoSchema.safeParse(getValues());
        if (!result.success) {
          void trigger();
          return false;
        }
        return true;
      },
      getData: () => getValues(),
    }),
    [isUploading, getValues, trigger]
  );

  const operatingHoursError =
    errors.startTime?.message || errors.endTime?.message;

  return (
    <div>
      <form>
        <div className="flex min-h-166 gap-8">
          <PosterImageField
            control={control}
            onUploadingChange={setIsUploading}
            disabled={isDisabled("posterImageUrl")}
          />

          <div className="flex flex-1 flex-col gap-4">
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">
                행사 명 <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="title"
                  {...register("title", { setValueAs: handleSetValueAs })}
                  placeholder="행사명을 입력해주세요. (최대 20자)"
                  maxLength={20}
                  aria-invalid={!!errors.title}
                  disabled={isDisabled("title")}
                />
              </div>
              <div className="h-3">
                <FieldError>{errors.title?.message}</FieldError>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.startDate}>
                <FieldLabel htmlFor="startDate">
                  시작일 <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  aria-invalid={!!errors.startDate}
                  disabled={isDisabled("startDate")}
                />
                <div className="h-3">
                  <FieldError>{errors.startDate?.message}</FieldError>
                </div>
              </Field>
              <Field data-invalid={!!errors.endDate}>
                <FieldLabel htmlFor="endDate">
                  종료일 <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  aria-invalid={!!errors.endDate}
                  disabled={isDisabled("endDate")}
                />
                <div className="h-3">
                  <FieldError>{errors.endDate?.message}</FieldError>
                </div>
              </Field>
            </div>

            <Field data-invalid={!!errors.location}>
              <FieldLabel htmlFor="location">
                주소 <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  {...register("location", { setValueAs: handleSetValueAs })}
                  placeholder="행사 주소를 입력해주세요. (최대 100자)"
                  className="pl-8"
                  maxLength={100}
                  aria-invalid={!!errors.location}
                  disabled={isDisabled("location")}
                />
              </div>
              <div className="h-3">
                <FieldError>{errors.location?.message}</FieldError>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="production">문의처 명</FieldLabel>
                <div className="relative">
                  <Input
                    id="production"
                    {...register("production", {
                      setValueAs: handleSetValueAs,
                    })}
                    placeholder="문의처 명을 입력해주세요. (최대 100자)"
                    className="pr-16"
                    maxLength={100}
                    disabled={isDisabled("production")}
                  />
                </div>
              </Field>
              <EventContactPhoneField
                control={control}
                disabled={isDisabled("contactPhone")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.contactEmail}>
                <FieldLabel htmlFor="contactEmail">문의처 이메일</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    {...register("contactEmail", {
                      setValueAs: handleSetValueAs,
                    })}
                    placeholder="문의처 이메일을 입력해주세요. (최대 254자)"
                    className="pl-8 pr-16"
                    maxLength={254}
                    aria-invalid={!!errors.contactEmail}
                    disabled={isDisabled("contactEmail")}
                  />
                </div>
                <div className="h-3">
                  <FieldError>{errors.contactEmail?.message}</FieldError>
                </div>
              </Field>
              <Field data-invalid={!!operatingHoursError}>
                <FieldLabel>
                  운영시간 <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    {...register("startTime")}
                    aria-invalid={!!errors.startTime}
                    disabled={isDisabled("startTime")}
                  />
                  <span className="shrink-0 text-muted-foreground">~</span>
                  <Input
                    type="time"
                    {...register("endTime")}
                    aria-invalid={!!errors.endTime}
                    disabled={isDisabled("startTime")}
                  />
                </div>
                <div className="h-3">
                  <FieldError>{operatingHoursError}</FieldError>
                </div>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="operatingRemarks">비고</FieldLabel>
              <div className="relative">
                <Textarea
                  id="operatingRemarks"
                  {...register("operatingRemarks", {
                    setValueAs: handleSetValueAs,
                  })}
                  placeholder="운영상의 특이사항을 입력해주세요. (최대 1000자)"
                  rows={3}
                  maxLength={1000}
                  className="resize-none pr-20"
                  disabled={isDisabled("operatingRemarks")}
                />
                <CharCount
                  control={control}
                  name="operatingRemarks"
                  maxLength={1000}
                  disabled={isDisabled("operatingRemarks")}
                  className="absolute right-3 bottom-3"
                />
              </div>
            </Field>
          </div>
        </div>
      </form>
    </div>
  );
});

export default EventInfoForm;
