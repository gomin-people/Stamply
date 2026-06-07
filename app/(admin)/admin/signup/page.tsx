"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import StamplyLogo from "@/components/admin/common/StamplyLogo";

const signUpSchema = z
  .object({
    email: z
      .string({ error: "이메일을 입력해주세요." })
      .min(1, { error: "이메일을 입력해주세요." })
      .email({ error: "올바른 이메일 형식을 입력해주세요." }),
    password: z
      .string({ error: "비밀번호를 입력해주세요." })
      .min(1, { error: "비밀번호를 입력해주세요." })
      .min(8, { error: "비밀번호는 8자 이상이어야 합니다." }),
    passwordConfirm: z
      .string({ error: "비밀번호 확인을 입력해주세요." })
      .min(1, { error: "비밀번호 확인을 입력해주세요." }),
  })
  .check((ctx) => {
    if (ctx.value.password !== ctx.value.passwordConfirm) {
      ctx.issues.push({
        code: "custom",
        path: ["passwordConfirm"],
        message: "비밀번호가 일치하지 않습니다.",
        input: ctx.value,
      });
    }
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignUpFieldErrors = Partial<Record<keyof SignUpFormValues, string>>;

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<SignUpFieldErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = signUpSchema.safeParse({ email, password, passwordConfirm });
    console.log(result);
    if (!result.success) {
      const fieldErrors = result.error.issues.reduce<SignUpFieldErrors>(
        (acc, issue) => {
          const key = issue.path[0] as keyof SignUpFormValues;
          if (key && !acc[key]) acc[key] = issue.message;
          return acc;
        },
        {}
      );
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
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
