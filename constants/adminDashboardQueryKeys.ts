// 어드민 대시보드 React Query key 모음
export const adminDashboardQueryKeys = {
  kpis: (eventId: number | null | undefined) =>
    ["admin", "events", eventId, "dashboard", "kpis"] as const,
  participantAnalysis: (eventId: number | null | undefined) =>
    ["admin", "events", eventId, "dashboard", "participant-analysis"] as const,
  achieverStatistics: (eventId: number | null | undefined) =>
    ["admin", "events", eventId, "dashboard", "achiever-statistics"] as const,
  missions: (eventId: number | null | undefined) =>
    ["admin", "events", eventId, "dashboard", "missions"] as const,
};
