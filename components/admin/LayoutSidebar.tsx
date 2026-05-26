'use client';

import { usePathname } from 'next/navigation';
import { getAdminRouteConfig } from '@/constants/adminRoutes';
import { getAdminEventIdFromPathname } from '@/utils/adminRoute';
import Sidebar from './Sidebar';

export default function LayoutSidebar() {
  const pathname = usePathname();
  const route = getAdminRouteConfig(pathname);
  const eventId = getAdminEventIdFromPathname(pathname);

  if (!route || !eventId) {
    return null;
  }

  return <Sidebar eventId={eventId} pathname={pathname} />;
}
