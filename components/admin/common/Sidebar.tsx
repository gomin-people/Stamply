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
import {
  useSelectedEventId,
  useSetSelectedEventId,
  useIsEditMode,
  useSetPendingHref,
} from "@/stores/admin";

// 관리자 이벤트 화면의 사이드바와 행사 등록 취소 이동 버튼 렌더링
const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { eventId } = useParams<{ eventId?: string }>();
  const route = getAdminRouteConfig(pathname);
  const selectedEventId = useSelectedEventId();
  const setSelectedEventId = useSetSelectedEventId();
  const isEditMode = useIsEditMode();
  const setPendingHref = useSetPendingHref();
  const { data: events = [] } = useAdminEventsQuery({ enabled: !eventId });
  const firstEvent = useMemo(
    () => [...events].sort(compareEventsByDisplayPriority)[0],
    [events]
  );
  const selectedEvent = events.find(
    (event) => String(event.id) === selectedEventId
  );
  const cancelTargetEventId =
    selectedEvent !== undefined
      ? String(selectedEvent.id)
      : firstEvent
        ? String(firstEvent.id)
        : null;

  if (!route) {
    return null;
  }

  const items = eventId ? getAdminSidebarItems(eventId) : [];
  const cancelCreate = () => {
    if (!cancelTargetEventId) return;

    const href = `/admin/events/${cancelTargetEventId}/dashboard`;

    if (isEditMode) {
      setPendingHref(href);
    } else {
      setSelectedEventId(cancelTargetEventId);
      router.push(href);
    }
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
      ) : cancelTargetEventId ? (
        <Button
          type="button"
          variant="outline"
          onClick={cancelCreate}
          className="mt-13 h-14 w-full cursor-pointer gap-3 rounded-xl px-3 pr-7 font-semibold text-md text-red-500 shadow-none hover:bg-red-100 border-red-500 hover:text-red-500"
        >
          <X className="size-5 text-red-500 " />
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
