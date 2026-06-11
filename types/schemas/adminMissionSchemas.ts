import { z } from "zod";

export const MissionFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "미션명을 입력해 주세요.")
    .max(20, "미션명은 최대 20자까지 입력가능합니다."),
  description: z
    .string()
    .trim()
    .max(500, "미션 설명은 최대 500자까지 입력가능합니다."),
});

export type MissionFormValues = z.infer<typeof MissionFormSchema>;

export const MissionCreateSchema = MissionFormSchema.extend({
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export type MissionCreateInput = z.infer<typeof MissionCreateSchema>;
