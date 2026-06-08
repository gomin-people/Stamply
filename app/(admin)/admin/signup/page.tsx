"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
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
      .string()
      .min(1, { error: "이메일을 입력해주세요." })
      .max(254, { error: "이메일은 254자 이하여야 합니다." })
      .email({ error: "올바른 이메일 형식을 입력해주세요." }),
    password: z
      .string()
      .min(1, { error: "비밀번호를 입력해주세요." })
      .min(8, { error: "비밀번호는 8자 이상이어야 합니다." }),
    passwordConfirm: z
      .string()
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

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: standardSchemaResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormValues) => {
    // TODO: Supabase 이메일 회원가입 연동
    console.log(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gomin-neutral-100 px-4">
      <div className="flex w-full max-w-125 flex-col items-center gap-8 rounded-2xl bg-white px-12 py-12 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <StamplyLogo />
          <p className="text-base text-gomin-neutral-500">관리자 계정 만들기</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-5"
        >
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">이메일</FieldLabel>
              <Input
                id="email"
                placeholder="example@email.com"
                aria-invalid={!!errors.email}
                className="h-12 rounded-xl px-4 text-sm"
                {...register("email")}
              />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="8자 이상 입력해주세요"
                aria-invalid={!!errors.password}
                className="h-12 rounded-xl px-4 text-sm"
                {...register("password")}
              />
              <FieldError>{errors.password?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.passwordConfirm}>
              <FieldLabel htmlFor="passwordConfirm">비밀번호 확인</FieldLabel>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                aria-invalid={!!errors.passwordConfirm}
                className="h-12 rounded-xl px-4 text-sm"
                {...register("passwordConfirm")}
              />
              <FieldError>{errors.passwordConfirm?.message}</FieldError>
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
