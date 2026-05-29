"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import AnimatedIconStamply from "@/components/icons/AnimatedIconStamply";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default function CompletePage({ params }: PageProps) {
  const { eventId } = React.use(params);
  const router = useRouter();

  const handleStaffConfirm = () => {
    const isConfirmed = window.confirm(
      "리워드를 지급하시겠습니까? (스태프 확인용)"
    );
    if (isConfirmed) {
      window.alert("리워드 지급이 완료되었습니다. 감사합니다!");
      router.push("/");
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gomin-primary-700 flex flex-col items-center justify-center p-6 text-center select-none z-50">
      <div className="max-w-md w-full flex flex-col items-center justify-center space-y-10">
        {/* 1. 중앙 Stamply 대형 원형 도장 그래픽 */}
        <div className="w-64 h-64 shrink-0 flex items-center justify-center relative select-none">
          <AnimatedIconStamply className="w-full h-full text-white opacity-95 animate-fade-in scale-110" />
        </div>

        {/* 2. 안내 안내 문구 */}
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
  );
}
