'use client';

import { useState } from 'react';
import IconStamply from '@/components/icons/IconStamply';
import Modal from '@/components/sample/Modal';
import Button from '@/components/sample/Button';
import { useQueryClient } from '@tanstack/react-query';

type Mission = {
  id: number;
  title: string;
  description: string;
  isStamped: boolean;
  token: string | null;
};

interface MissionItemProps {
  mission: Mission;
}

export default function MissionItem({ mission }: MissionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  // TODO: [테스트용 코드 - 배포 전 삭제] - START
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const handleTestToggle = async () => {
    setIsPending(true);
    try {
      const isStamped = mission.isStamped;
      
      let response: Response;
      if (isStamped) {
        response = await fetch('/api/v1/participant/missions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ missionId: mission.id }),
        });
      } else {
        if (!mission.token) {
          alert('미션 완료 처리를 위한 QR 토큰이 발급되지 않았습니다.');
          setIsPending(false);
          return;
        }
        response = await fetch(`/api/v1/qr/mission-check/${mission.token}`, {
          method: 'POST',
        });
      }

      if (response.ok) {
        await queryClient.invalidateQueries({
          queryKey: ['participant', 'missions'],
        });
      } else {
        alert(isStamped ? '테스트 미션 취소 처리 실패' : '테스트 미션 완료 처리 실패');
      }
    } catch (err) {
      console.error(err);
      alert('통신 중 오류가 발생했습니다.');
    } finally {
      setIsPending(false);
    }
  };
  // TODO: [테스트용 코드 - 배포 전 삭제] - END

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-6 p-4 rounded-[20px] cursor-pointer w-full select-none transition-all duration-300 hover:shadow-md active:scale-[0.99] shadow-sm border border-transparent ${
          mission.isStamped ? 'bg-[#F3F1FE]' : 'bg-[#EBEBEB]'
        }`}
      >
        {/* 스탬프 도장 이미지 영역 (왼쪽) - 둥근 원 테두리를 제거하고 순수 이미지 노출 */}
        <div className="w-26 h-26 shrink-0 relative flex items-center justify-center select-none">
          <IconStamply
            className={`w-full h-full ${
              mission.isStamped
                ? 'text-gomin-primary-700 opacity-100'
                : 'text-gomin-neutral-400 opacity-30'
            }`}
          />
        </div>

        {/* 텍스트 정보 영역 (오른쪽) */}
        <div className="flex flex-col text-left space-y-2 flex-1">
          <span
            className={`text-[25px] font-sans font-black tracking-tight leading-none ${
              mission.isStamped
                ? 'text-gomin-primary-700'
                : 'text-gomin-neutral-600'
            }`}
          >
            {mission.title}
          </span>
          <div
            className={`flex flex-col text-[16px] font-sans font-bold leading-tight tracking-tight whitespace-pre-line ${
              mission.isStamped
                ? 'text-gomin-neutral-600'
                : 'text-gomin-neutral-500'
            }`}
          >
            {mission.description}
          </div>
        </div>
      </div>

      {/* 미션 상세 모달 */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-2 p-1">
          <span className="inline-block self-start px-2.5 py-0.5 text-xs font-semibold text-gomin-primary-700 bg-gomin-primary-100 rounded-full mb-1">
            미션 정보
          </span>
          <h4 className="font-extrabold text-xl text-gomin-black">
            {mission.title}
          </h4>
          <p className="text-gomin-neutral-500 text-sm mt-1 leading-relaxed">
            {mission.description}
          </p>
          <div className="flex items-center gap-2 mt-4 p-3 bg-gomin-neutral-100 rounded-xl">
            <span className="text-lg">{mission.isStamped ? '🎉' : '🔒'}</span>
            <span className="text-sm font-semibold text-gomin-neutral-700">
              {mission.isStamped
                ? '이미 완료된 미션입니다!'
                : '아직 미완료된 미션입니다. QR코드를 스캔해 보세요!'}
            </span>
          </div>

          {/* TODO: [테스트용 코드 - 배포 전 삭제] - START */}
          {/* 개발자 테스트용 상태 전환 버튼 추가 */}
          <button
            disabled={isPending}
            onClick={handleTestToggle}
            className={`mt-4 w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] cursor-pointer border border-dashed ${
              mission.isStamped
                ? 'border-red-400 bg-red-50/30 text-red-500 hover:bg-red-50'
                : 'border-green-400 bg-green-50/30 text-green-600 hover:bg-green-50'
            }`}
          >
            {isPending
              ? '처리 중...'
              : mission.isStamped
              ? '🛠️ [테스트] 미션 완료 취소하기'
              : '🛠️ [테스트] 강제 미션 완료하기'}
          </button>
          {/* TODO: [테스트용 코드 - 배포 전 삭제] - END */}

          <Button
            className="mt-3 w-full py-3.5 rounded-xl font-bold bg-gomin-primary-700 hover:bg-gomin-primary-600 text-white transition-all active:scale-[0.98]"
            onClick={() => setIsOpen(false)}
          >
            닫기
          </Button>
        </div>
      </Modal>
    </>
  );
}
