'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { getAdminRouteConfig } from '@/constants/adminRoutes';

export default function LayoutHeader() {
  const pathname = usePathname();
  const route = getAdminRouteConfig(pathname);

  if (!route) {
    return null;
  }

  return <Header title={route.title} />;
}
