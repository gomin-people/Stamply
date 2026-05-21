'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface HeaderProps {
    showBackButton?: boolean
    onBackClick?: () => void
}

const Header = ({
    showBackButton = true,
    onBackClick,
}: HeaderProps) => {
    const router = useRouter()

    const handleBack = () => {
        if (onBackClick) {
            onBackClick()
        } else {
            router.back()
        }
    }

    return (
        <header className="relative w-full h-14 flex items-center justify-between px-4">
            {/* Left Area: Back Button */}
            <div className="flex items-center min-w-10">
                {showBackButton && (
                    <button
                        onClick={handleBack}
                        className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full"
                        aria-label="이전 화면으로 이동"
                    >
                        <Image
                            src="/images/icon_back_button.svg"
                            alt="뒤로가기"
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                    </button>
                )}
            </div>
        </header>
    )
}

export default Header