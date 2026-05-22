import KakaoLogin from "@/components/admin/kakao-login";
import Logo from "@/components/admin/logo";

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-gomin-neutral-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-125 bg-white rounded-2xl shadow-sm px-12 py-12 flex flex-col items-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <Logo />
          <p className="text-base text-[#6D6D6D]">행사 운영 관리자 로그인</p>
        </div>

        <KakaoLogin />
      </div>

    </main>
  );
}
