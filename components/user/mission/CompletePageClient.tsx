"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AnimatedIconStamplo from "@/components/icons/AnimatedIconStamplo";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSubmitSurveyMutation } from "@/features/participant/survey/participantSurveyMutations";

const CompletePageClient = () => {
  const router = useRouter();
  const { eventId } = useParams<{ eventId: string }>();
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const { mutate: claimReward, isPending } = useSubmitSurveyMutation();

  const handleStaffConfirm = () => {
    setIsCompleteModalOpen(true);
  };

  const handleConfirmClose = () => {
    if (isPending) return;

    claimReward(
      { isRewardClaimed: true },
      {
        onSuccess: () => {
          setIsCompleteModalOpen(false);
          router.push(`/event/${eventId}`);
        },
        onError: (err: Error) => {
          console.error("Reward claim failed:", err);
          alert("수령 확인 처리에 실패했습니다. 다시 시도해 주세요.");
        },
      }
    );
  };

  return (
    <>
      <div className="fixed inset-0 w-full h-full bg-gomin-primary-700 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full flex flex-col items-center justify-center space-y-10">
          {/* 1. 중앙 Stamplo 대형 원형 도장 그래픽 */}
          <div className="w-64 h-64 shrink-0 flex items-center justify-center relative select-none">
            <AnimatedIconStamplo className="w-full h-full text-white opacity-95 animate-fade-in scale-110" />
          </div>

          {/* 2. 안내 문구 */}
          <p className="text-xl font-nanum font-extrabold text-white leading-relaxed tracking-tight whitespace-pre-line">
            리워드 수령처에서 이 화면을{"\n"}스태프에게 보여주세요!
          </p>

          {/* 3. 하단 직원 확인 버튼 */}
          <div className="w-full max-w-xs pt-4">
            <button
              type="button"
              onClick={handleStaffConfirm}
              className="w-full py-4.5 rounded-[22px] font-nanum font-extrabold text-[18px] bg-white text-gomin-primary-700 hover:bg-gomin-primary-100 transition-all shadow-lg active:scale-[0.98] cursor-pointer"
            >
              직원 확인 버튼
            </button>
          </div>
        </div>
      </div>

      {/* 미션완료 팝업 모달 */}
      <Dialog open={isCompleteModalOpen} onOpenChange={handleConfirmClose}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-xs bg-white p-6 rounded-[24px] border border-gomin-primary-300 text-center flex flex-col items-center justify-center"
        >
          {/* 체크 성공 아이콘 그래픽 */}
          <div className="w-16 h-16 bg-gomin-primary-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gomin-primary-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <DialogTitle className="text-xl font-nanum font-extrabold text-gomin-black mb-2">
            미션완료
          </DialogTitle>
          <DialogDescription className="text-sm font-nanum font-semibold text-gomin-neutral-500 mb-6 whitespace-pre-line">
            리워드 지급이 완료되었습니다.{"\n"}감사합니다!
          </DialogDescription>

          <button
            type="button"
            onClick={handleConfirmClose}
            disabled={isPending}
            className="w-full py-3.5 rounded-[18px] font-nanum font-bold text-[16px] bg-gomin-primary-700 hover:bg-gomin-primary-600 disabled:bg-gomin-neutral-200 disabled:text-gomin-neutral-400 disabled:cursor-not-allowed text-white transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? (
              <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "확인"
            )}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompletePageClient;
