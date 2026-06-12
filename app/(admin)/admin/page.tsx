import { cookies } from "next/headers";
import Link from "next/link";
import AuthRedirect from "@/components/admin/auth/AuthRedirect";
import KakaoLogin from "@/components/admin/auth/KakaoLogin";
import TestLoginButton from "@/components/admin/auth/TestLoginButton";
import StamploLogo from "@/components/admin/common/StamploLogo";
import EmailLoginForm from "@/components/admin/auth/EmailLoginForm";

const AdminHomePage = async () => {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some(({ name }) => {
    return name.startsWith("sb-");
  });

  if (hasSession) {
    return <AuthRedirect />;
  }

  return (
    <main className="min-h-screen bg-gomin-neutral-100 flex flex-col items-center justify-center px-4">
      <div className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:zoom-in-98 flex w-full max-w-125 flex-col items-center gap-8 rounded-2xl bg-white px-12 py-12 shadow-sm motion-safe:duration-300 motion-safe:ease-out">
        <div className="flex flex-col items-center gap-2">
          <StamploLogo />
          <p className="text-base text-[#6D6D6D]">행사 운영 관리자 로그인</p>
        </div>

        <EmailLoginForm />

        <p className="text-sm text-gomin-neutral-500">
          계정이 없으신가요?{" "}
          <Link
            href="/admin/signup"
            className="font-medium text-gomin-primary-700 hover:underline"
          >
            회원가입
          </Link>
        </p>
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gomin-neutral-100" />
            <span className="text-xs text-gomin-neutral-400">또는</span>
            <div className="h-px flex-1 bg-gomin-neutral-100" />
          </div>
          <KakaoLogin />
          <TestLoginButton />
        </div>
      </div>
    </main>
  );
};

export default AdminHomePage;
