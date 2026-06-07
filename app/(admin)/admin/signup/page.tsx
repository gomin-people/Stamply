"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import StamplyLogo from "@/components/admin/common/StamplyLogo";

type SignUpFieldErrors = {
  email?: string;
  password?: string;
  passwordConfirm?: string;
};

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<SignUpFieldErrors>({});

  const validate = (): boolean => {
    const next: SignUpFieldErrors = {};

    if (!email) {
      next.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!password) {
      next.password = "비밀번호를 입력해주세요.";
    } else if (password.length < 8) {
      next.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (!passwordConfirm) {
      next.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (password !== passwordConfirm) {
      next.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: Supabase 이메일 회원가입 연동
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gomin-neutral-100 px-4">
      <div className="flex w-full max-w-125 flex-col items-center gap-8 rounded-2xl bg-white px-12 py-12 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <StamplyLogo />
          <p className="text-base text-gomin-neutral-500">관리자 계정 만들기</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">이메일</FieldLabel>
              <Input
                id="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                className="h-12 rounded-xl px-4 text-sm"
              />
              <FieldError>{errors.email}</FieldError>
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="8자 이상 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                className="h-12 rounded-xl px-4 text-sm"
              />
              <FieldError>{errors.password}</FieldError>
            </Field>

            <Field data-invalid={!!errors.passwordConfirm}>
              <FieldLabel htmlFor="passwordConfirm">비밀번호 확인</FieldLabel>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                aria-invalid={!!errors.passwordConfirm}
                className="h-12 rounded-xl px-4 text-sm"
              />
              <FieldError>{errors.passwordConfirm}</FieldError>
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="mt-1 h-12 w-full rounded-xl bg-gomin-primary-700 text-base font-semibold text-white hover:bg-gomin-primary-600 active:bg-gomin-primary-700"
          >
            회원가입
          </Button>
        </form>

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
  );
}
