'use client';

import { usePathname } from 'next/navigation';
import { getAdminRouteConfig } from '@/constants/adminRoutes';
import Sidebar from './Sidebar';

const getEventId = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const eventIdIndex = segments.indexOf('events') + 1;

  return eventIdIndex > 0 ? segments[eventIdIndex] : null;
};

export default function LayoutSidebar() {
  const pathname = usePathname();
  const route = getAdminRouteConfig(pathname);
  const eventId = getEventId(pathname);

  if (!route || !eventId) {
    return null;
  }

  return <Sidebar eventId={eventId} pathname={pathname} />;
}
