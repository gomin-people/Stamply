// QR 코드 용도 enum 타입
export type QrCodeType = "MISSION" | "ENTRY" | "REWARD";

// 참여자 설문 성별 enum 타입
export type Gender = "MALE" | "FEMALE" | "UNKNOWN";

// 행사 API 응답 타입
export type EventModel = {
  id: number;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  operatingRemarks: string | null;
  location: string;
  locationUrl: string | null;
  notice: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  production: string;
  posterImageUrl: string;
  brochureImageUrl: string[] | null;
  stampImageUrl: string | null;
  primaryColor: string;
  rewardStock: number;
  createdAt: string;
  updatedAt: string;
};

// 미션 API 응답 타입
export type MissionModel = {
  id: number;
  eventsId: number;
  title: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface QrCodeModelBase {
  id: number;
  token: string;
}

// QR 코드 API 응답 타입
export interface QrCodeModel extends QrCodeModelBase {
  eventsId: number;
  missionsId: number | null;
  type: QrCodeType;
  createdAt: string;
}

// 참여자 API 응답 타입
export type ParticipantModel = {
  id: number;
  eventsId: number;
  userId: string | null;
  eventUserId: string;
  createdAt: string;
  gender: Gender | null;
  ageRange: string | null;
  isRewardClaimed: boolean;
};

// 미션 완료 API 응답 타입
export type MissionCompletionModel = {
  id: number;
  eventsId: number;
  missionsId: number;
  participantUsersId: number;
  completedAt: string;
};

// 행사 생성 요청 타입
export type EventCreatePayloadModel = {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  operatingRemarks?: string | null;
  location: string;
  locationUrl?: string | null;
  notice?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  production: string;
  posterImageUrl: string;
  brochureImageUrl?: unknown;
  stampImageUrl?: string | null;
  primaryColor?: string;
  rewardStock?: number;
};

// 행사 수정 요청 타입
export type EventUpdatePayloadModel = Partial<EventCreatePayloadModel>;

// 미션 생성 요청 타입
export type MissionCreatePayloadModel = {
  title: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

// 미션 수정 요청 타입
export type MissionUpdatePayloadModel = Partial<MissionCreatePayloadModel>;

// 설문 저장 요청 타입
export type SurveyPayloadModel = {
  gender?: Gender | null;
  ageRange?: string | null;
};

export interface AdminMissionDetail extends MissionModel {
  qrCodes: QrCodeModel[] | null;
}

export interface AdminUserModel {
  id: string;
  name: string;
}
