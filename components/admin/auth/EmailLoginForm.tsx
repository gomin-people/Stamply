"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useAdminLoginMutation } from "@/features/admin/login/adminLoginMutations";
import { ApiError } from "@/features/shared/api/http";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: "이메일을 입력해주세요." })
    .email({ error: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(1, { error: "비밀번호를 입력해주세요." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const EmailLoginFormEmailLoginForm = () => {
  const router = useRouter();
  const { mutateAsync: login } = useAdminLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: standardSchemaResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "로그인에 실패했습니다. 다시 시도해주세요.";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="login-email">이메일</FieldLabel>
          <Input
            id="login-email"
            placeholder="example@email.com"
            aria-invalid={!!errors.email}
            className="h-12 rounded-xl px-4 text-sm"
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="login-password">비밀번호</FieldLabel>
          <Input
            id="login-password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            aria-invalid={!!errors.password}
            className="h-12 rounded-xl px-4 text-sm"
            {...register("password")}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-gomin-primary-700 text-base font-semibold text-white hover:bg-gomin-primary-600 active:bg-gomin-primary-700"
      >
        {isSubmitting ? "로그인 중..." : "이메일로 로그인"}
      </Button>
    </form>
  );
};

export default EmailLoginFormEmailLoginForm;
