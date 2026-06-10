import StamploLogo from "@/components/admin/common/StamploLogo";
import SignUpForm from "@/components/admin/auth/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gomin-neutral-100 px-4">
        <div className="flex w-full max-w-125 flex-col items-center gap-8 rounded-2xl bg-white px-12 py-12 shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <StamploLogo />
            <p className="text-base text-gomin-neutral-500">
              관리자 계정 만들기
            </p>
          </div>
          <SignUpForm />
          <p className="text-sm text-gomin-neutral-500">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/admin"
              className="font-medium text-gomin-primary-700 hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
