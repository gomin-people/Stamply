import { KeyRound } from "lucide-react";

const TestLoginButton = () => {
  return (
    <form action="/api/v1/admin/test-login" method="post" className="w-full">
      <button
        type="submit"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gomin-neutral-200 bg-white px-6 py-4 text-base font-semibold tracking-tight text-gomin-neutral-700 transition-colors hover:bg-gomin-neutral-100 active:bg-gomin-neutral-200"
      >
        <KeyRound className="h-5 w-5" aria-hidden="true" />
        테스트 로그인
      </button>
    </form>
  );
};

export default TestLoginButton;
