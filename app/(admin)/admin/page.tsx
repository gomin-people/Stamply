import { cookies } from "next/headers";
import KakaoLogin from "@/components/admin/auth/KakaoLogin";
import StamplyLogo from "@/components/admin/common/StamplyLogo";
import AuthRedirect from "@/components/admin/auth/AuthRedirect";

export default async function AdminHomePage() {
  const cookieStore = await cookies();
  const hasSession = cookieStore
    .getAll()
    .some(({ name }) => name.startsWith("sb-") && name.endsWith("-auth-token"));

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
        <KakaoLogin />
      </div>
    </main>
  );
}
