import { z } from "zod";

export const signupApiSchema = z.object({
  name: z
    .string()
    .min(2, { error: "이름은 2자 이상이여야 합니다" })
    .max(16, { error: "이름은 16자 이하여야 합니다." })
    .regex(/^[가-힣a-zA-Z\s]+$/, {
      error: "이름은 한글 또는 영문만 입력 가능합니다.",
    }),
  email: z
    .string()
    .min(1, { error: "이메일을 입력해주세요." })
    .max(254, { error: "이메일은 254자 이하여야 합니다." })
    .email({ error: "올바른 이메일 형식을 입력해주세요." }),
  password: z
    .string()
    .min(1, { error: "비밀번호를 입력해주세요." })
    .min(8, { error: "비밀번호는 8자 이상이어야 합니다." }),
});

export const signupFormSchema = signupApiSchema
  .extend({
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

export type SignUpFormValues = z.infer<typeof signupFormSchema>;
