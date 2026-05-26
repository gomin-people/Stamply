'use client'

import { useState } from 'react'
import IconStamply from '@/components/icons/IconStamply'
import Modal from '@/components/sample/Modal'
import Button from '@/components/sample/Button'

type Mission = {
  id: number
  title: string
  description: string
  isStamped: boolean
}

interface MissionStampProps {
  mission: Mission
}

export default function MissionStamp({ mission }: MissionStampProps) {
  const [isOpen, setIsOpen] = useState(false)



  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`relative aspect-square flex flex-col items-center justify-center p-5 rounded-3xl cursor-pointer shadow-md select-none transition-all duration-300 hover:shadow-lg active:scale-[0.97] overflow-hidden ${
          mission.isStamped
            ? 'bg-gomin-primary-100 border border-gomin-primary-200/50'
            : 'bg-gomin-neutral-100 border border-transparent'
        }`}
      >
        {/* 미션 텍스트 (도장이 찍혔을 경우 도장 아래에 겹쳐서 보임) */}
        <div className={`flex flex-col items-center justify-center text-center space-y-2 z-10 ${
          mission.isStamped ? 'text-gomin-primary-700/60' : 'text-gomin-neutral-500'
        }`}>
          <span className={`text-xl font-black ${
            mission.isStamped ? 'text-gomin-neutral-800/80' : 'text-gomin-neutral-700'
          }`}>
            {mission.title}
          </span>
          <p className={`text-xs leading-relaxed max-w-[120px] font-medium ${
            mission.isStamped ? 'text-gomin-neutral-500/70' : 'text-gomin-neutral-400'
          }`}>
            {mission.description}
          </p>
        </div>

        {/* 완료 상태일 때 보라색 도장 오버레이 */}
        {mission.isStamped && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 select-none transform rotate-[-12deg] scale-[0.95] text-gomin-primary-700">
            <IconStamply className="w-[81%] h-[85%] aspect-[162/171] opacity-95 animate-fade-in" />
          </div>
        )}
      </div>

      {/* 미션 상세 모달 */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-2 p-1">
          <span className="inline-block self-start px-2.5 py-0.5 text-xs font-semibold text-gomin-primary-700 bg-gomin-primary-100 rounded-full mb-1">
            미션 정보
          </span>
          <h4 className="font-extrabold text-xl text-gomin-black">{mission.title}</h4>
          <p className="text-gomin-neutral-500 text-sm mt-1 leading-relaxed">{mission.description}</p>
          <div className="flex items-center gap-2 mt-4 p-3 bg-gomin-neutral-100 rounded-xl">
            <span className="text-lg">
              {mission.isStamped ? '🎉' : '🔒'}
            </span>
            <span className="text-sm font-semibold text-gomin-neutral-700">
              {mission.isStamped ? '이미 완료된 미션입니다!' : '아직 미완료된 미션입니다. QR코드를 스캔해 보세요!'}
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
  )
}
