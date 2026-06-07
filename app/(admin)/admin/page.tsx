import { cookies } from "next/headers";
import AuthRedirect from "@/components/admin/auth/AuthRedirect";
import KakaoLogin from "@/components/admin/auth/KakaoLogin";
import TestLoginButton from "@/components/admin/auth/TestLoginButton";
import StamplyLogo from "@/components/admin/common/StamplyLogo";

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
      <div className="w-full max-w-125 bg-white rounded-2xl shadow-sm px-12 py-12 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <StamplyLogo />
          <p className="text-base text-[#6D6D6D]">행사 운영 관리자 로그인</p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <KakaoLogin />
          <TestLoginButton />
        </div>
      </div>
    </main>
  );
};

export default AdminHomePage;
