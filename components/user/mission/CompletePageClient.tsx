"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import AnimatedIconStamplo from "@/components/icons/AnimatedIconStamplo";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useCreateRewardQrMutation,
  type RewardQrData,
} from "@/features/participant/reward/participantRewardMutations";
import { createBrowserSupabaseClient } from "@/utils/supabase/browser";
import RewardQrModal from "./RewardQrModal";
import MissionCompleteModal from "./MissionCompleteModal";

const CompletePageClient = () => {
  const router = useRouter();
  const { eventId } = useParams<{ eventId: string }>();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const { mutate: createRewardQr, isPending } = useCreateRewardQrMutation();

  useEffect(() => {
    if (!qrValue) return;

    const supabase = createBrowserSupabaseClient();
    const channel = supabase.channel(`reward-claim:${qrValue}`, {
      config: {
        broadcast: { self: false },
      },
    });

    channel
      .on("broadcast", { event: "claim_success" }, () => {
        setIsQrModalOpen(false);
        setIsCompleteModalOpen(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qrValue]);

  const handleStaffConfirm = () => {
    createRewardQr(undefined, {
      onSuccess: (data: RewardQrData) => {
        // QR value: 어드민 스캔 시 즉시 호출 가능한 API URL 설정
        const currentOrigin = window.location.origin;
        setQrValue(data.eventUserId);
        setQrUrl(`${currentOrigin}/api/v1/qr/reward/${data.eventUserId}`);
        setIsQrModalOpen(true);
      },
      onError: (err: Error) => {
        console.error("Reward QR 생성 실패:", err);
        alert("QR 생성에 실패했습니다. 다시 시도해 주세요.");
      },
    });
  };

  const handleQrModalClose = (open: boolean) => {
    if (!open) {
      setIsQrModalOpen(false);
    }
  };

  const handleConfirmClose = () => {
    setIsCompleteModalOpen(false);
    router.push(`/event/${eventId}`);
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
              disabled={isPending}
              className="w-full py-4.5 rounded-[22px] font-nanum font-extrabold text-[18px] bg-white text-gomin-primary-700 hover:bg-gomin-primary-100 disabled:bg-gomin-primary-200 disabled:text-gomin-primary-400 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {isPending ? (
                <span className="size-5 border-2 border-gomin-primary-700 border-t-transparent rounded-full animate-spin" />
              ) : (
                "리워드 QR 생성"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* REWARD QR 모달 */}
      <RewardQrModal
        isOpen={isQrModalOpen}
        onClose={handleQrModalClose}
        qrUrl={qrUrl}
        eventId={eventId}
      />

      {/* 미션완료 팝업 모달 */}
      <MissionCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={handleConfirmClose}
      />
    </>
  );
};

export default CompletePageClient;
