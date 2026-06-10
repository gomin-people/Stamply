import { z } from "zod";
import { isValidPhone } from "@/utils";

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

export const EventInfoSchema = z
  .object({
    posterImageUrl: z.string().min(1, "이미지를 등록해주세요."),
    title: z
      .string()
      .trim()
      .min(1, "행사명을 입력해주세요.")
      .max(20, "행사명은 최대 20자까지 입력 가능합니다."),
    startDate: z.string().min(1, "시작일을 입력해주세요."),
    endDate: z.string().min(1, "종료일을 입력해주세요."),
    location: z
      .string()
      .trim()
      .min(1, "행사 장소를 입력해주세요.")
      .max(100, "행사 장소는 최대 100자까지 입력 가능합니다."),
    locationUrl: z
      .string()
      .trim()
      .max(100, "행사 지도 링크는 최대 100자까지 입력 가능합니다.")
      .refine(
        (val) =>
          !val ||
          z
            .url({ protocol: /^https$/, hostname: z.regexes.domain })
            .safeParse(val).success,
        "https:// 로 시작하는 올바른 URL을 입력해주세요."
      ),
    production: z
      .string()
      .trim()
      .max(100, "문의처명은 최대 100자까지 입력 가능합니다."),
    contactPhone: z
      .string()
      .trim()
      .refine(
        (val) => !val || isValidPhone(val),
        "올바른 전화번호 형식으로 입력해주세요."
      ),
    contactEmail: z
      .string()
      .trim()
      .max(254, "문의처 이메일은 최대 254자까지 입력 가능합니다.")
      .refine(
        (val) => !val || z.email().safeParse(val).success,
        "올바른 이메일 형식으로 입력해주세요."
      ),
    startTime: z.string().min(1, "시작 시간을 입력해주세요."),
    endTime: z.string().min(1, "종료 시간을 입력해주세요."),
    operatingRemarks: z
      .string()
      .trim()
      .max(100, "비고는 최대 100자까지 입력 가능합니다."),
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
