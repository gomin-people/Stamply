import {
  BarChart3,
  ClipboardList,
  FileText,
  type LucideIcon,
} from 'lucide-react'; // todo: 아이콘 라이브러리 변경 고려

export type AdminRouteConfig = {
  pattern: string;
  title: string;
  sidebar?: {
    title?: string;
    icon: LucideIcon;
  };
};

type AdminRouteParams = {
  eventId: string;
};

/**
 * 관리자 페이지의 라우트별 헤더/사이드바 정보 관리
 */
export const adminRoutes: AdminRouteConfig[] = [
  {
    pattern: '/admin/events/[eventId]/dashboard',
    title: '대시보드',
    sidebar: {
      icon: BarChart3,
    },
  },
  {
    pattern: '/admin/events/[eventId]',
    title: '행사 상세',
    sidebar: {
      title: '행사 관리',
      icon: FileText,
    },
  },
  {
    pattern: '/admin/events/[eventId]/missions',
    title: '미션 관리',
    sidebar: {
      icon: ClipboardList,
    },
  },
];

/**
 * Next.js 라우트 패턴을 실제 URL과 비교 ( /admin/events/[eventId] == /admin/events/123 )
 */
const patternToRegex = (pattern: string) => {
  const regex = pattern.replace(/\[[^\]]+\]/g, '[^/]+');
  return new RegExp(`^${regex}$`);
};

const getAdminRoutePath = (pattern: string, params: AdminRouteParams) => {
  return pattern.replace(/\[eventId\]/g, params.eventId);
};

/**
 * 현재 경로에 해당하는 관리자 라우트 설정
 */
export const getAdminRouteConfig = (pathname: string) => {
  return adminRoutes.find((route) =>
    patternToRegex(route.pattern).test(pathname)
  );
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
