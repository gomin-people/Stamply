// 대시보드 KPI 카드 식별자
export type AdminDashboardKpiKey =
  | "participants"
  | "missionInProgress"
  | "missionCompleted"
  | "rewardClaimed";

// 대시보드 KPI 카드 숫자 응답 타입
export type AdminDashboardKpiCount = {
  today: number;
  total: number;
};

// 대시보드 KPI 4개 카드 응답 타입
export type AdminDashboardKpisResponse = Record<
  AdminDashboardKpiKey,
  AdminDashboardKpiCount
>;

// 날짜별 참여자 수 데이터
export type AdminDashboardDailyParticipant = {
  label: string;
  count: number;
};

// 시간대별 참여자 수 데이터
export type AdminDashboardHourlyParticipant = {
  hour: number;
  label: string;
  count: number;
};

// 날짜별 시간대 차트 mock 보정 계수
export type AdminDashboardHourlyDateFactor = {
  label: string;
  factor: number;
};

// 참여자 수 분석 차트 응답 타입
export type AdminDashboardParticipantAnalysisResponse = {
  daily: AdminDashboardDailyParticipant[];
  hourlyTotal: AdminDashboardHourlyParticipant[];
  hourlyDateFactors: AdminDashboardHourlyDateFactor[];
};

// 달성자 성별 통계 데이터
export type AdminDashboardGenderStatistic = {
  label: string;
  value: number;
  color: string;
};

// 달성자 연령대 통계 데이터
export type AdminDashboardAgeRangeStatistic = {
  label: string;
  percent: number;
  color: string;
};

// 달성자 통계 응답 타입
export type AdminDashboardAchieverStatisticsResponse = {
  totalAchievers: number;
  gender: AdminDashboardGenderStatistic[];
  ageRange: AdminDashboardAgeRangeStatistic[];
};

// 미션별 완료 현황 데이터
export type AdminDashboardMissionStatus = {
  id: number;
  title: string;
  completedCount: number;
  completionRate: number;
};

// 미션별 완료 현황 응답 타입
export type AdminDashboardMissionsResponse = {
  missions: AdminDashboardMissionStatus[];
};
