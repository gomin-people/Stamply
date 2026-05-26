export default function KakaoLogin() {
    return <a
        href="/api/v1/oauth/kakao/login"
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] hover:bg-[#F0D800] active:bg-[#E0C800] transition-colors py-4 px-6 cursor-pointer"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="#000000"
            aria-hidden="true"
        >
            <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.73 1.636 5.134 4.11 6.58L5.05 21l4.56-2.42A11.45 11.45 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3Z" />
        </svg>
        <span className="text-base font-semibold text-gomin-black tracking-tight">
            카카오 로그인
        </span>
    </a>

}