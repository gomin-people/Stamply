// QR 코드 용도 enum 타입
export type QrCodeType = 'MISSION' | 'ENTRY' | 'REWARD';

// 참여자 설문 성별 enum 타입
export type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';

// 행사 API 응답 타입
export type StamplyEvent = {
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
export type Mission = {
  id: number;
  eventsId: number;
  title: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// QR 코드 API 응답 타입
export type QrCode = {
  id: number;
  eventsId: number;
  missionsId: number | null;
  type: QrCodeType;
  token: string;
  createdAt: string;
};

// 참여자 API 응답 타입
export type Participant = {
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
export type MissionCompletion = {
  id: number;
  eventsId: number;
  missionsId: number;
  participantUsersId: number;
  completedAt: string;
};

// 행사 생성 요청 타입
export type EventCreatePayload = {
  userId: string;
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
export type EventUpdatePayload = Partial<EventCreatePayload>;

// 미션 생성 요청 타입
export type MissionCreatePayload = {
  title: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

// 미션 수정 요청 타입
export type MissionUpdatePayload = Partial<MissionCreatePayload>;

// 설문 저장 요청 타입
export type SurveyPayload = {
  gender?: Gender | null;
  ageRange?: string | null;
  isRewardClaimed?: boolean;
};
