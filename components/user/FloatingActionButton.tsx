'use client'

import { ScanLine } from 'lucide-react'

interface FloatingActionButtonProps {
  isAllCompleted: boolean
  onClick: () => void
}

export default function FloatingActionButton({
  isAllCompleted,
  onClick,
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 h-14 font-extrabold text-lg text-white bg-gomin-primary-700 hover:bg-gomin-primary-600 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_rgba(84,53,235,0.35)] active:scale-[0.97] hover:scale-[1.01]"
      >
        {!isAllCompleted ? (
          <>
            <ScanLine className="w-5 h-5 stroke-[2.5]" />
            <span>QR 체크하기</span>
          </>
        ) : (
          <span>리워드 수령하기</span>
        )}
      </button>
    </div>
  )
}
