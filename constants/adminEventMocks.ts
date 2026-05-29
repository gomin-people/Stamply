export type AdminEventStatus = "진행중" | "예정" | "종료";

export type AdminEventOption = {
  id: string;
  title: string;
  status: AdminEventStatus;
};

// 관리자 행사 선택 임시 목록
export const adminEventOptions: AdminEventOption[] = [
  {
    id: "1",
    title: "2026 성수 팝업 페스타",
    status: "진행중",
  },
  {
    id: "2",
    title: "2027 성수 팝업 페스타",
    status: "예정",
  },
  {
    id: "3",
    title: "2028 성수 팝업 페스타",
    status: "종료",
  },
];

// 관리자 행사 옵션 조회
export const getAdminEventOption = (eventId: string) => {
  return adminEventOptions.find((event) => event.id === eventId);
};

// 관리자 행사명 조회
export const getAdminEventTitle = (eventId: string) => {
  return getAdminEventOption(eventId)?.title ?? `행사 ${eventId}`;
};
