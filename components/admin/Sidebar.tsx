'use client';

import { usePathname } from 'next/navigation';
import {
  getAdminRouteConfig,
  getAdminSidebarItems,
} from '@/constants/adminRoutes';
import { getAdminEventIdFromPathname } from '@/utils/adminRoute';
import EventSelector from './EventSelector';
import SidebarNav from './SidebarNav';
import AdminUserInfo from '@/components/admin/AdminUserInfo';

const Sidebar = () => {
  const pathname = usePathname();
  const route = getAdminRouteConfig(pathname);
  const eventId = getAdminEventIdFromPathname(pathname);

  if (!route || !eventId) {
    return null;
  }

  const items = getAdminSidebarItems(eventId);

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-gomin-neutral-100 bg-gomin-white px-4 py-5">
      <div>
        <h1 className="text-xl text-gomin-black">stamply</h1>
      </div>

      <EventSelector key={eventId} eventId={eventId} />
      <SidebarNav items={items} pathname={pathname} />

      <div className="mt-auto">
        <AdminUserInfo />
      </div>
    </aside>
  );
};

export default Sidebar;
