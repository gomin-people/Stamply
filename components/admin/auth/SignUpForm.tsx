"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import {
  signupFormSchema,
  type SignUpFormValues,
} from "@/types/schemas/adminSignupSchemas";
import { useAdminSignupMutation } from "@/features/admin/signup/adminSignupMutations";
import { ApiError } from "@/features/shared/api/http";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const { mutateAsync: signUp } = useAdminSignupMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: standardSchemaResolver(signupFormSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      router.replace("/admin");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "회원가입에 실패했습니다. 다시 시도해주세요.";
      toast.error(message, { id: "signup-error" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5"
    >
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">이름</FieldLabel>
          <Input
            id="name"
            placeholder="이름을 입력해주세요"
            aria-invalid={!!errors.name}
            className="h-12 rounded-xl px-4 text-sm"
            {...register("name")}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

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
        disabled={isSubmitting}
        className="mt-1 h-12 w-full rounded-xl bg-gomin-primary-700 text-base font-semibold text-white hover:bg-gomin-primary-600 active:bg-gomin-primary-700"
      >
        {isSubmitting ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
};

export default SignUpForm;
