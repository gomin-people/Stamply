"use client";

import { useParams, usePathname } from "next/navigation";
import {
  getAdminRouteConfig,
  getAdminSidebarItems,
} from "@/constants/adminRoutes";
import EventSelector from "./EventSelector";
import SidebarNav from "./SidebarNav";
import AdminUserInfo from "@/components/admin/common/AdminUserInfo";
import StamplyLogo from "@/components/admin/common/StamplyLogo";

const Sidebar = () => {
  const pathname = usePathname();
  const { eventId } = useParams<{ eventId?: string }>();
  const route = getAdminRouteConfig(pathname);

  if (!route) {
    return null;
  }

  const items = eventId ? getAdminSidebarItems(eventId) : [];

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-gomin-neutral-100 bg-gomin-white px-4 py-5">
      <div className="ml-3">
        <StamplyLogo />
      </div>

      {eventId && (
        <>
          <EventSelector key={eventId} eventId={eventId} />
          <SidebarNav items={items} pathname={pathname} />
        </>
      )}

      <div className="mt-auto">
        <AdminUserInfo />
      </div>
    </aside>
  );
};

export default Sidebar;
