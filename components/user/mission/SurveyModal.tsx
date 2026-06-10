"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSubmitSurveyMutation } from "@/features/participant/survey/participantSurveyMutations";
import { type Gender } from "@/types/models";
import { useModalHistoryBack } from "@/hooks/useModalHistoryBack";

type GenderType = Gender | null;
type AgeRangeType = "10대" | "20대" | "30대" | "40대" | "50대+" | null;

type SurveyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
};

export default function SurveyModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: SurveyModalProps) {
  const [gender, setGender] = useState<GenderType>(null);
  const [ageRange, setAgeRange] = useState<AgeRangeType>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: submitSurvey, isPending } = useSubmitSurveyMutation();

  const handleClose = () => {
    if (!isPending) onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  useModalHistoryBack(isOpen, handleClose);

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
  };

  const handleAgeSelect = (selectedAge: Exclude<AgeRangeType, null>) => {
    setAgeRange(selectedAge);
  };

  const handleSubmit = () => {
    if (!gender || !ageRange) return;

    setErrorMessage(null);

    submitSurvey(
      {
        gender,
        ageRange,
      },
      {
        onSuccess: () => {
          onSubmitSuccess();
        },
        onError: (error: Error) => {
          setErrorMessage(
            error.message || "설문 제출에 실패했습니다. 다시 시도해 주세요."
          );
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-gomin-white p-6 rounded-[24px] border border-gomin-primary-300"
      >
        {/* 우측 상단 닫기 버튼 */}
        <button
          onClick={handleClose}
          disabled={isPending}
          className="absolute right-5 top-5 text-gomin-neutral-700 hover:text-gomin-black disabled:opacity-50 transition-colors"
          aria-label="닫기"
        >
          <X className="size-6" />
        </button>

        {/* 타이틀 영역 */}
        <div className="text-left mt-2 mb-6">
          <DialogTitle className="text-[22px] font-nanum font-extrabold leading-[30px] text-gomin-black whitespace-pre-line">
            정보 입력하고{"\n"}리워드 받아가세요!
          </DialogTitle>
          <DialogDescription className="sr-only">
            리워드 수령을 위해 성별과 연령대 정보를 입력해 주세요.
          </DialogDescription>
        </div>

        {/* 성별 선택 영역 */}
        <div className="flex flex-col text-left mb-5">
          <span className="text-[15px] font-nanum font-bold text-gomin-black mb-3">
            성별
          </span>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => handleGenderSelect("MALE")}
              className={`w-20 py-2 rounded-lg font-nanum font-semibold text-sm border transition-all active:scale-[0.96] ${
                gender === "MALE"
                  ? "bg-gomin-primary-100 border-gomin-primary-500 text-gomin-primary-700 font-bold"
                  : "bg-white border-gomin-neutral-200 text-gomin-neutral-400"
              }`}
            >
              남
            </button>
            <button
              type="button"
              onClick={() => handleGenderSelect("FEMALE")}
              className={`w-20 py-2 rounded-lg font-nanum font-semibold text-sm border transition-all active:scale-[0.96] ${
                gender === "FEMALE"
                  ? "bg-gomin-primary-100 border-gomin-primary-500 text-gomin-primary-700 font-bold"
                  : "bg-white border-gomin-neutral-200 text-gomin-neutral-400"
              }`}
            >
              여
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleGenderSelect("UNKNOWN")}
            className={`mt-2 text-xs font-semibold underline cursor-pointer hover:text-gomin-neutral-600 self-start transition-colors ${
              gender === "UNKNOWN"
                ? "text-gomin-primary-700 font-bold"
                : "text-gomin-neutral-400"
            }`}
          >
            선택안함
          </button>
        </div>

        {/* 연령대 선택 영역 */}
        <div className="flex flex-col text-left mb-6">
          <span className="text-[15px] font-nanum font-bold text-gomin-black mb-3">
            연령대
          </span>
          <div className="grid grid-cols-4 gap-2.5">
            {(["10대", "20대", "30대", "40대", "50대+"] as const).map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => handleAgeSelect(age)}
                className={`py-2 px-3 rounded-lg font-nanum font-semibold text-sm border transition-all active:scale-[0.96] ${
                  ageRange === age
                    ? "bg-gomin-primary-100 border-gomin-primary-500 text-gomin-primary-700 font-bold"
                    : "bg-white border-gomin-neutral-200 text-gomin-neutral-400"
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* 에러 메시지 노출 */}
        {errorMessage && (
          <p className="text-destructive text-xs font-semibold mb-3 text-left">
            {errorMessage}
          </p>
        )}

        {/* 제출하기 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || gender === null || ageRange === null}
          className="w-full py-4 rounded-[18px] font-nanum font-bold text-[17px] bg-gomin-primary-700 hover:bg-gomin-primary-600 disabled:bg-gomin-neutral-200 disabled:text-gomin-neutral-400 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-gomin-primary-700/10 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isPending ? (
            <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "제출하기"
          )}
        </button>
      </DialogContent>
    </Dialog>
  );
}
