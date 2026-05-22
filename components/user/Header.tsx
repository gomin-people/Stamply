'use client'

import { useRouter } from 'next/navigation'
import { SVGProps } from 'react'

const ChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        fill="currentColor"
        {...props}
    >
        <path d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z" />
    </svg>
)


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
                        className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full text-gray-700 hover:text-gray-900 active:bg-gray-100 transition-colors"
                        aria-label="이전 화면으로 이동"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
        </header>
    )
}

export default Header