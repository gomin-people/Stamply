// API 성공 응답의 공통 래퍼 타입
export type ApiDataResponse<T> = {
  data: T;
};

/**
 * API 응답 실패를 status와 함께 표현하는 에러입니다.
 */
export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * JSON API를 호출하고 `{ data }` 응답에서 data만 꺼내 반환합니다.
 *
 * @param path - 호출할 API 경로
 * @param init - fetch 요청 옵션
 * @returns API 응답의 data 값
 */
export async function requestJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });
  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(body), response.status, body);
  }

  if (isRecord(body) && "data" in body) {
    return body.data as T;
  }

  return body as T;
}

/**
 * JSON 요청 본문을 포함한 RequestInit 객체를 만듭니다.
 *
 * @param method - HTTP method
 * @param body - JSON으로 직렬화할 요청 본문
 * @returns fetch에 전달할 RequestInit
 */
export function createJsonRequest(method: string, body?: unknown): RequestInit {
  return {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}

/**
 * fetch 응답 본문을 안전하게 JSON으로 파싱합니다.
 *
 * @param response - fetch 응답 객체
 * @returns JSON 파싱 결과 또는 null
 */
async function parseJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/**
 * API 에러 응답에서 사용자에게 보여줄 메시지를 추출합니다.
 *
 * @param body - API 응답 본문
 * @returns 에러 메시지
 */
function getErrorMessage(body: unknown) {
  if (isRecord(body) && typeof body.message === "string") {
    return body.message;
  }

  return "API 요청 실패";
}

/**
 * unknown 값이 일반 객체인지 확인합니다.
 *
 * @param value - 검사할 값
 * @returns 일반 객체이면 true
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
