import { House, LayoutGrid, Target, type LucideIcon } from "lucide-react"; // todo: 아이콘 라이브러리 변경 고려

export type AdminRouteConfig = {
  pattern: string;
  title: string;
  description?: AdminRouteDescriptionSegment[];
  sidebar?: {
    title?: string;
    icon: LucideIcon;
  };
};

export type AdminRouteDescriptionSegment =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "eventTitle";
    };

type AdminRouteParams = {
  eventId: string;
};

/**
 * 관리자 페이지의 라우트별 헤더/사이드바 정보 관리
 */
export const adminRoutes: AdminRouteConfig[] = [
  {
    pattern: "/admin/events/[eventId]/dashboard",
    title: "대시보드",
    description: [
      { type: "text", text: "현재 운영 중인 행사 · " },
      { type: "eventTitle" },
      { type: "text", text: "의 실시간 현황입니다." },
    ],
    sidebar: {
      icon: LayoutGrid,
    },
  },
  {
    pattern: "/admin/events/[eventId]",
    title: "행사 상세",
    description: [
      { type: "eventTitle" },
      {
        type: "text",
        text: "의 등록 정보를 수정합니다. 변경사항은 저장 시 즉시 반영됩니다.",
      },
    ],
    sidebar: {
      title: "행사 관리",
      icon: House,
    },
  },
  {
    pattern: "/admin/events/[eventId]/missions",
    title: "미션 관리",
    description: [
      { type: "eventTitle" },
      {
        type: "text",
        text: "의 미션 목록입니다. 행을 끌어 순서를 변경할 수 있습니다. 최대 10개까지 미션을 활성화할 수 있습니다.",
      },
    ],
    sidebar: {
      icon: Target,
    },
  },
];

/**
 * Next.js 라우트 패턴을 실제 URL과 비교 ( /admin/events/[eventId] == /admin/events/123 )
 */
const patternToRegex = (pattern: string) => {
  const regex = pattern.replace(/\[[^\]]+\]/g, "[^/]+");
  return new RegExp(`^${regex}$`);
};

const getAdminRoutePath = (pattern: string, params: AdminRouteParams) => {
  return pattern.replace(/\[eventId\]/g, params.eventId);
};

/**
 * 현재 경로에 해당하는 관리자 라우트 설정
 */
export const getAdminRouteConfig = (pathname: string) => {
  return [...adminRoutes]
    .sort((a, b) => b.pattern.length - a.pattern.length)
    .find((route) => patternToRegex(route.pattern).test(pathname));
};

/**
 * 사이드바에 표시할 관리자 메뉴 정보
 */
export const getAdminSidebarItems = (eventId: string) => {
  return adminRoutes.flatMap((route) => {
    if (!route.sidebar) {
      return [];
    }

    return {
      label: route.sidebar.title ?? route.title,
      href: getAdminRoutePath(route.pattern, { eventId }),
      icon: route.sidebar.icon,
    };
  });
};
