"use client";

import { useMemo } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  getAdminRouteConfig,
  getAdminSidebarItems,
} from "@/constants/adminRoutes";
import EventSelector, { compareEventsByDisplayPriority } from "./EventSelector";
import SidebarNav from "./SidebarNav";
import AdminUserInfo from "@/components/admin/common/AdminUserInfo";
import StamplyLogo from "@/components/admin/common/StamplyLogo";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAdminEventsQuery } from "@/features/admin/events/adminEventQueries";
import { useSetSelectedEventId } from "@/stores/admin";

// 관리자 이벤트 화면의 사이드바와 행사 등록 취소 이동 버튼 렌더링
const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { eventId } = useParams<{ eventId?: string }>();
  const route = getAdminRouteConfig(pathname);
  const setSelectedEventId = useSetSelectedEventId();
  const { data: events = [] } = useAdminEventsQuery({ enabled: !eventId });
  const firstEvent = useMemo(
    () => [...events].sort(compareEventsByDisplayPriority)[0],
    [events]
  );

  if (!route) {
    return null;
  }

  const items = eventId ? getAdminSidebarItems(eventId) : [];
  const cancelCreate = () => {
    if (!firstEvent) {
      return;
    }

    const nextEventId = String(firstEvent.id);
    setSelectedEventId(nextEventId);
    router.push(`/admin/events/${nextEventId}/dashboard`);
  };

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-gomin-neutral-100 bg-gomin-white px-4 py-5">
      <div className="ml-3">
        <StamplyLogo />
      </div>

      {eventId ? (
        <>
          <EventSelector key={eventId} eventId={eventId} />
          <SidebarNav items={items} pathname={pathname} />
        </>
      ) : firstEvent ? (
        <Button
          type="button"
          variant="outline"
          onClick={cancelCreate}
          className="mt-13 h-14 w-full cursor-pointer gap-3 rounded-xl px-3 font-semibold text-md border-gomin-neutral-300 hover:border-gomin-neutral-500 text-gomin-neutral-600 shadow-none bg-gomin-neutral-100 hover:bg-gomin-neutral-200"
        >
          <X className="size-5 text-gomin-neutral-700 hover:text-gomin-black" />
          생성 취소
        </Button>
      ) : null}

      <div className="mt-auto">
        <AdminUserInfo />
      </div>
    </aside>
  );
};

export default Sidebar;
