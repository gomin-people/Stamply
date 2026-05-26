'use client';

import { useState } from 'react';
import IconStamply from '@/components/icons/IconStamply';
import Modal from '@/components/sample/Modal';
import Button from '@/components/sample/Button';

type Mission = {
  id: number;
  title: string;
  description: string;
  isStamped: boolean;
};

interface MissionItemProps {
  mission: Mission;
}

export default function MissionItem({ mission }: MissionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-6 p-6 rounded-[32px] cursor-pointer w-full select-none transition-all duration-300 hover:shadow-md active:scale-[0.99] shadow-sm border border-transparent ${
          mission.isStamped ? 'bg-[#F3F1FE]' : 'bg-[#EBEBEB]'
        }`}
      >
        {/* 스탬프 도장 이미지 영역 (왼쪽) - 둥근 원 테두리를 제거하고 순수 이미지 노출 */}
        <div className="w-20 h-20 shrink-0 relative flex items-center justify-center select-none">
          <IconStamply
            className={`w-full h-full ${
              mission.isStamped
                ? 'text-gomin-primary-700 opacity-100'
                : 'text-gomin-neutral-400 opacity-30'
            }`}
          />
        </div>

        {/* 텍스트 정보 영역 (오른쪽) */}
        <div className="flex flex-col text-left space-y-1.5 flex-1">
          <span
            className={`text-[25px] font-black tracking-tight leading-none ${
              mission.isStamped
                ? 'text-gomin-primary-700'
                : 'text-gomin-neutral-600'
            }`}
          >
            {mission.title}
          </span>
          <div className="flex flex-col text-[16px] font-bold text-gomin-black leading-tight tracking-tight whitespace-pre-line">
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
          <Button
            className="mt-6 w-full py-3.5 rounded-xl font-bold bg-gomin-primary-700 hover:bg-gomin-primary-600 text-white transition-all active:scale-[0.98]"
            onClick={() => setIsOpen(false)}
          >
            닫기
          </Button>
        </div>
      </Modal>
    </>
  );
}
