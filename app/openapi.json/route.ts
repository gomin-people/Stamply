const jsonContent = {
  "application/json": {
    schema: {
      type: "object",
    },
  },
};

const okResponse = {
  description: "요청에 성공했습니다.",
  content: jsonContent,
};

const createdResponse = {
  description: "리소스가 생성되었습니다.",
  content: jsonContent,
};

const errorResponse = {
  description: "서버 처리 중 오류가 발생했습니다.",
  content: jsonContent,
};

const badRequestResponse = {
  description: "요청 값이 올바르지 않습니다.",
  content: jsonContent,
};

const unauthorizedResponse = {
  description: "참여자 쿠키가 없거나 올바르지 않습니다.",
  content: jsonContent,
};

const forbiddenResponse = {
  description: "요청한 작업을 수행할 권한이 없습니다.",
  content: jsonContent,
};

const notFoundResponse = {
  description: "요청한 리소스를 찾을 수 없습니다.",
  content: jsonContent,
};

const conflictResponse = {
  description: "이미 처리된 요청이거나 현재 상태와 충돌합니다.",
  content: jsonContent,
};

const eventIdParameter = {
  name: "eventId",
  in: "path",
  description: "Events row의 id입니다.",
  required: true,
  schema: {
    type: "string",
  },
};

const missionIdParameter = {
  name: "missionId",
  in: "path",
  description: "Missions row의 id입니다.",
  required: true,
  schema: {
    type: "string",
  },
};

const tokenParameter = {
  name: "token",
  in: "path",
  description: "qr_codes row의 token입니다.",
  required: true,
  schema: {
    type: "string",
  },
};

const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Stamply API",
    version: "1.0.0",
    description: "Stamply MVP API 문서입니다.",
  },
  servers: [
    {
      url: "/",
      description: "현재 origin",
    },
  ],
  tags: [
    { name: "관리자 Events", description: "관리자용 Events API입니다." },
    { name: "관리자 Missions", description: "관리자용 Missions API입니다." },
    { name: "관리자 대시보드", description: "관리자 대시보드 집계 API입니다." },
    { name: "입장", description: "ENTRY QR 기반 행사 입장 API입니다." },
    {
      name: "참여자",
      description: "현재 참여자 상태, Events, 설문 API입니다.",
    },
    {
      name: "Mission 완료",
      description: "MISSION QR 기반 완료 처리 API입니다.",
    },
    { name: "테스트", description: "개발 검증용 API입니다." },
  ],
  paths: {
    "/api/v1/test/rls/events": {
      get: {
        tags: ["테스트"],
        summary: "RLS 테스트용 Events 목록 조회",
        description:
          "service role이 아닌 현재 Supabase 세션 쿠키로 events를 조회합니다. user_id 필터를 직접 걸지 않으므로 RLS 적용 여부를 확인할 수 있습니다. 추후 삭제 예정입니다.",
        operationId: "testRlsEvents",
        responses: {
          "200": okResponse,
          "401": unauthorizedResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/admin/events": {
      get: {
        tags: ["관리자 Events"],
        summary: "관리자 Events 목록 조회",
        operationId: "listAdminEvents",
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "500": errorResponse,
        },
      },
      post: {
        tags: ["관리자 Events"],
        summary: "관리자 Events 생성",
        operationId: "createAdminEvent",
        responses: {
          "201": createdResponse,
          "400": badRequestResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/admin/events/{eventId}": {
      get: {
        tags: ["관리자 Events"],
        summary: "관리자 Events 상세 조회",
        operationId: "getAdminEvent",
        parameters: [eventIdParameter],
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
      patch: {
        tags: ["관리자 Events"],
        summary: "관리자 Events 수정",
        operationId: "updateAdminEvent",
        parameters: [eventIdParameter],
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
      delete: {
        tags: ["관리자 Events"],
        summary: "관리자 Events 삭제",
        operationId: "deleteAdminEvent",
        parameters: [eventIdParameter],
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/admin/events/{eventId}/missions": {
      get: {
        tags: ["관리자 Missions"],
        summary: "Events 하위 Missions 목록 조회",
        operationId: "listAdminEventMissions",
        parameters: [eventIdParameter],
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "500": errorResponse,
        },
      },
      post: {
        tags: ["관리자 Missions"],
        summary: "Events 하위 Missions 생성",
        operationId: "createAdminEventMission",
        parameters: [eventIdParameter],
        responses: {
          "201": createdResponse,
          "400": badRequestResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/admin/events/{eventId}/missions/{missionId}": {
      get: {
        tags: ["관리자 Missions"],
        summary: "Missions 상세 조회",
        operationId: "getAdminEventMission",
        parameters: [eventIdParameter, missionIdParameter],
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
      patch: {
        tags: ["관리자 Missions"],
        summary: "Missions 수정",
        operationId: "updateAdminEventMission",
        parameters: [eventIdParameter, missionIdParameter],
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
      delete: {
        tags: ["관리자 Missions"],
        summary: "Missions 삭제",
        operationId: "deleteAdminEventMission",
        parameters: [eventIdParameter, missionIdParameter],
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/admin/events/{eventId}/dashboard": {
      get: {
        tags: ["관리자 대시보드"],
        summary: "Events 대시보드 지표 조회",
        operationId: "getAdminEventDashboard",
        parameters: [eventIdParameter],
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/qr/entry/{token}": {
      get: {
        tags: ["입장"],
        summary: "ENTRY QR token으로 행사 입장",
        operationId: "enterEvent",
        parameters: [tokenParameter],
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/participant": {
      get: {
        tags: ["참여자"],
        summary: "현재 참여자 상태 조회",
        operationId: "getParticipant",
        responses: {
          "200": okResponse,
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/participant/events/{eventId}": {
      get: {
        tags: ["참여자"],
        summary: "현재 참여자가 입장한 Events 상세 조회",
        operationId: "getParticipantEvent",
        parameters: [eventIdParameter],
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/participant/missions": {
      get: {
        tags: ["참여자"],
        summary: "현재 참여자의 Missions 진행 상태 조회",
        operationId: "getParticipantMissions",
        responses: {
          "200": okResponse,
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/participant/survey": {
      get: {
        tags: ["참여자"],
        summary: "현재 참여자의 설문 상태 조회",
        operationId: "getParticipantSurvey",
        responses: {
          "200": okResponse,
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
      post: {
        tags: ["참여자"],
        summary: "현재 참여자의 설문 제출",
        operationId: "submitParticipantSurvey",
        responses: {
          "200": okResponse,
          "400": badRequestResponse,
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "500": errorResponse,
        },
      },
    },
    "/api/v1/qr/mission-check/{token}": {
      post: {
        tags: ["Mission 완료"],
        summary: "MISSION QR token으로 Missions 완료 처리",
        operationId: "completeMissionByToken",
        parameters: [tokenParameter],
        responses: {
          "201": createdResponse,
          "400": badRequestResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
          "409": conflictResponse,
          "500": errorResponse,
        },
      },
    },
  },
};

export async function GET() {
  return Response.json(openApiDocument);
}
