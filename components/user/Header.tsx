'use client';

import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header = ({ showBackButton = true, onBackClick }: HeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <header className="relative w-full h-14 flex items-center justify-between px-4">
      {/* Left Area: Back Button */}
      <div className="flex items-center min-w-10">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full text-gray-700 hover:text-gray-900 active:bg-gray-100 transition-colors"
            aria-label="이전 화면으로 이동"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
