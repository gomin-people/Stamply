"use client";

import { useRouter } from "next/navigation";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";

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
    <header className="sticky top-0 z-50 w-full h-14 flex items-center justify-between px-4 bg-transparent pointer-events-none">
      {/* Left Area: Back Button */}
      <div className="flex items-center min-w-10">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="pointer-events-auto flex items-center justify-center w-11 h-11 -ml-1 mt-4 rounded-full bg-white/80 backdrop-blur-md text-gray-700 hover:text-gray-900 hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-black/5"
            aria-label="이전 화면으로 이동"
          >
            <ChevronLeftIcon className="w-8 h-8 -ml-0.5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
