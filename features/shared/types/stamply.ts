// QR 코드 용도 enum 타입
export type QrCodeType = 'MISSION' | 'ENTRY' | 'REWARD';

// 참여자 설문 성별 enum 타입
export type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';

// events 테이블 row 타입
export type StamplyEvent = {
  id: number;
  user_id: number;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  operating_remarks: string | null;
  location: string;
  notice: string | null;
  contact: string;
  production: string;
  poster_image_url: string | null;
  brochure_image_url: unknown;
  stamp_image_url: string | null;
  primary_color: string;
  reward_stock: number;
  created_at: string;
  updated_at: string;
};

// missions 테이블 row 타입
export type Mission = {
  id: number;
  events_id: number;
  title: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// qr_codes 테이블 row 타입
export type QrCode = {
  id: number;
  events_id: number;
  missions_id: number | null;
  type: QrCodeType;
  token: string;
  created_at: string;
};

// participant_users 테이블 row 타입
export type Participant = {
  id: number;
  events_id: number;
  user_id: number | null;
  event_user_id: string;
  created_at: string;
  gender: Gender | null;
  age_range: string | null;
  is_reward_claimed: boolean;
};

// mission_completions 테이블 row 타입
export type MissionCompletion = {
  id: number;
  events_id: number;
  missions_id: number;
  participant_users_id: number;
  completed_at: string;
};

// 행사 생성 요청 타입
export type EventCreatePayload = {
  user_id: number;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  operating_remarks?: string | null;
  location: string;
  notice?: string | null;
  contact: string;
  production: string;
  poster_image_url?: string | null;
  brochure_image_url?: unknown;
  stamp_image_url?: string | null;
  primary_color?: string;
  reward_stock?: number;
};

// 행사 수정 요청 타입
export type EventUpdatePayload = Partial<EventCreatePayload>;

// 미션 생성 요청 타입
export type MissionCreatePayload = {
  title: string;
  description?: string | null;
  sort_order?: number;
  is_active?: boolean;
};

// 미션 수정 요청 타입
export type MissionUpdatePayload = Partial<MissionCreatePayload>;

// 설문 저장 요청 타입
export type SurveyPayload = {
  gender?: Gender | null;
  age_range?: string | null;
  is_reward_claimed?: boolean;
};
