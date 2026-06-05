import { KeyRound } from "lucide-react";

const KakaoLogin = () => {
  return (
    <div className="flex w-full flex-col gap-3">
      <a
        href="/api/v1/oauth/kakao/login"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 py-4 transition-colors hover:bg-[#F0D800] active:bg-[#E0C800]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="#000000"
          aria-hidden="true"
        >
          <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.73 1.636 5.134 4.11 6.58L5.05 21l4.56-2.42A11.45 11.45 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3Z" />
        </svg>
        <span className="text-base font-semibold tracking-tight text-gomin-black">
          카카오 로그인
        </span>
      </a>

      <form action="/api/v1/admin/test-login" method="post" className="w-full">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gomin-neutral-200 bg-white px-6 py-4 text-base font-semibold tracking-tight text-gomin-neutral-700 transition-colors hover:bg-gomin-neutral-100 active:bg-gomin-neutral-200"
        >
          <KeyRound className="h-5 w-5" aria-hidden="true" />
          테스트 로그인
        </button>
      </form>
    </div>
  );
};

export default KakaoLogin;
