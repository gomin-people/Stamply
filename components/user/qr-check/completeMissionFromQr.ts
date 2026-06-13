import {
  getResponseMessage,
  parseJsonResponse,
} from "@/features/shared/api/http";
import { getUserUnavailablePath } from "./qrCheckUtils";

export const ALREADY_COMPLETED_MISSION_MESSAGE = "이미 완료된 미션입니다";
export const MISSION_CHECK_FAILED_MESSAGE = "미션 확인에 실패했습니다";

type CompleteMissionFromQrResult =
  | {
      type: "completed"; // 미션 완료
      missionId: number;
    }
  | {
      type: "alreadyCompleted"; // 이미 완료한 미션
      message: string;
    }
  | {
      type: "qrRequired"; // 입장 QR 필요
    }
  | {
      type: "missionUnavailable"; // 삭제되었거나 비활성화된 미션
      path: string;
    }
  | {
      type: "failed"; // 미션 확인 실패
      message: string;
    };

/**
 * QR 스캔 화면에서 미션 완료 API를 호출하고 UI가 처리하기 쉬운 결과로 정규화합니다.
 *
 * @param path - 미션 완료 API 경로
 * @returns 미션 완료 처리 결과
 */
export const completeMissionFromQr = async (
  path: string
): Promise<CompleteMissionFromQrResult> => {
  try {
    const response = await fetch(path, {
      method: "POST",
      credentials: "include",
    });
    const body = await parseJsonResponse(response);
    const responseMessage = getResponseMessage(body);

    if (response.status === 201) {
      return {
        type: "completed",
        missionId: (body as { data?: { mission?: { id?: number } } })?.data
          ?.mission?.id as number,
      };
    }

    if (response.status === 409) {
      return {
        type: "alreadyCompleted",
        message: ALREADY_COMPLETED_MISSION_MESSAGE,
      };
    }

    if (
      response.status === 401 ||
      responseMessage === "참여자 정보가 없습니다." ||
      responseMessage === "참여자를 찾을 수 없습니다."
    ) {
      return { type: "qrRequired" };
    }

    if (
      response.status === 404 &&
      (responseMessage === "비활성화된 미션입니다." ||
        responseMessage === "존재하지 않는 미션입니다.")
    ) {
      return {
        type: "missionUnavailable",
        path: getUserUnavailablePath(responseMessage),
      };
    }

    return {
      type: "failed",
      message: responseMessage ?? MISSION_CHECK_FAILED_MESSAGE,
    };
  } catch (error) {
    console.error("Mission check failed:", error);

    return {
      type: "failed",
      message: MISSION_CHECK_FAILED_MESSAGE,
    };
  }
};
