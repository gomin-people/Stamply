'use client';

import { ScanLine } from 'lucide-react';
import ThemedButton from '@/components/user/common/ThemedButton';

interface FloatingActionButtonProps {
  isAllCompleted: boolean;
  onClick: () => void;
}

export default function FloatingActionButton({
  isAllCompleted,
  onClick,
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
      <ThemedButton
        onClick={onClick}
        className="w-full max-w-none"
      >
        {!isAllCompleted ? (
          <>
            <ScanLine className="w-5 h-5 stroke-[2.5]" />
            <span>QR 체크하기</span>
          </>
        ) : (
          <span>리워드 수령하기</span>
        )}
      </ThemedButton>
    </div>
  );
}
