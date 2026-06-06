import { cookies } from "next/headers";
import AuthRedirect from "@/components/admin/auth/AuthRedirect";
import KakaoLogin from "@/components/admin/auth/KakaoLogin";
import TestLoginButton from "@/components/admin/auth/TestLoginButton";
import StamplyLogo from "@/components/admin/common/StamplyLogo";

type AdminHomePageProps = {
  searchParams?: Promise<{
    error?: string | string[];
  }>;
};

const ADMIN_LOGIN_ERROR_MESSAGES = {
  missing_code: "카카오 로그인 요청을 다시 시도해주세요.",
  token_failed: "카카오 인증 토큰을 확인하지 못했습니다.",
  auth_failed: "로그인 인증에 실패했습니다.",
  test_login_disabled: "테스트 로그인이 비활성화되어 있습니다.",
  test_login_not_configured: "테스트 로그인 설정을 확인해주세요.",
  test_login_failed: "테스트 계정 로그인에 실패했습니다.",
} as const;

const getAdminLoginErrorMessage = (error?: string | string[]) => {
  const normalizedError = Array.isArray(error) ? error[0] : error;

  if (!normalizedError) {
    return null;
  }

  return (
    ADMIN_LOGIN_ERROR_MESSAGES[
      normalizedError as keyof typeof ADMIN_LOGIN_ERROR_MESSAGES
    ] ?? "로그인을 다시 시도해주세요."
  );
};

const AdminHomePage = async ({ searchParams }: AdminHomePageProps) => {
  const params = await searchParams;
  const errorMessage = getAdminLoginErrorMessage(params?.error);
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

        {errorMessage ? (
          <p
            role="alert"
            className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="flex w-full flex-col gap-3">
          <KakaoLogin />
          <TestLoginButton />
        </div>
      </div>
    </main>
  );
};

export default AdminHomePage;
