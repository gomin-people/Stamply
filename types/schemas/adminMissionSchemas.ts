import { z } from "zod";

export const MissionFormSchema = z.object({
  title: z.string().trim().min(1, "미션명을 입력해 주세요.").max(20),
  description: z.string().trim().max(500),
});

export type MissionFormValues = z.infer<typeof MissionFormSchema>;

export const MissionCreateSchema = MissionFormSchema.extend({
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export type MissionCreateInput = z.infer<typeof MissionCreateSchema>;
