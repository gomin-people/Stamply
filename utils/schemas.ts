import { z } from "zod";
import { isValidEmail, isValidPhone, isValidUrl } from "@/utils";

export const imageSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "5MB 이하 이미지만 업로드할 수 있습니다."
  )
  .refine(
    (file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type),
    "png, jpg, webp만 업로드할 수 있습니다."
  );

export const eventInfoSchema = z
  .object({
    posterImageUrl: z.string().min(1, "이미지를 등록해주세요."),
    title: z.string().min(1, "행사명을 입력해주세요."),
    startDate: z.string().min(1, "시작일을 입력해주세요."),
    endDate: z.string().min(1, "종료일을 입력해주세요."),
    location: z.string().min(1, "행사 장소를 입력해주세요."),
    locationUrl: z
      .string()
      .refine(
        (val) => !val || isValidUrl(val),
        "올바른 URL 형식으로 입력해주세요."
      ),
    production: z.string(),
    contactPhone: z
      .string()
      .refine(
        (val) => !val || isValidPhone(val),
        "올바른 전화번호 형식으로 입력해주세요."
      ),
    contactEmail: z
      .string()
      .refine(
        (val) => !val || isValidEmail(val),
        "올바른 이메일 형식으로 입력해주세요."
      ),
    startTime: z.string().min(1, "시작 시간을 입력해주세요."),
    endTime: z.string().min(1, "종료 시간을 입력해주세요."),
    operatingRemarks: z.string(),
  })
  .refine(
    (data) =>
      !data.endDate || !data.startDate || data.endDate >= data.startDate,
    { path: ["endDate"], message: "종료일은 시작일 이후여야 합니다." }
  )
  .refine(
    (data) => !data.endTime || !data.startTime || data.endTime > data.startTime,
    { path: ["endTime"], message: "종료 시간은 시작 시간 이후여야 합니다." }
  );
