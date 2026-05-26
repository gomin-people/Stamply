'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { getAdminRouteConfig } from '@/constants/adminRoutes';
import { getAdminEventTitle } from '@/constants/adminEventMocks';
import { getAdminEventIdFromPathname } from '@/utils/adminRoute';

export default function LayoutHeader() {
  const pathname = usePathname();
  const route = getAdminRouteConfig(pathname);
  const eventId = getAdminEventIdFromPathname(pathname);

  if (!route) {
    return null;
  }

  return (
    <Header
      title={route.title}
      description={route.description}
      eventTitle={eventId ? getAdminEventTitle(eventId) : undefined}
    />
  );
}
