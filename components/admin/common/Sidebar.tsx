"use client";

import { useMemo, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  getAdminRouteConfig,
  getAdminSidebarItems,
} from "@/constants/adminRoutes";
import EventSelector, { compareEventsByDisplayPriority } from "./EventSelector";
import SidebarNav from "./SidebarNav";
import AdminUserInfo from "@/components/admin/common/AdminUserInfo";
import StamploLogo from "@/components/admin/common/StamploLogo";
import RewardQrScannerClient from "@/components/admin/reward/RewardQrScannerClient";
import { Button } from "@/components/ui/button";
import { ScanTextIcon, type ScanTextIconHandle } from "lucide-animated";
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
  const [isRewardQrOpen, setIsRewardQrOpen] = useState(false);
  const rewardQrIconRef = useRef<ScanTextIconHandle>(null);
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
  const openRewardQr = () => {
    setIsRewardQrOpen(true);
  };
  const startRewardQrIconAnimation = () => {
    rewardQrIconRef.current?.startAnimation();
  };
  const stopRewardQrIconAnimation = () => {
    rewardQrIconRef.current?.stopAnimation();
  };

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-gomin-neutral-100 bg-gomin-white px-4 py-5">
      <div className="ml-3">
        <StamploLogo />
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
        {eventId && (
          <Button
            type="button"
            variant="outline"
            onClick={openRewardQr}
            onPointerEnter={startRewardQrIconAnimation}
            onPointerLeave={stopRewardQrIconAnimation}
            onFocus={startRewardQrIconAnimation}
            onBlur={stopRewardQrIconAnimation}
            className="mb-4 h-14 w-full cursor-pointer gap-2 rounded-xl border-gomin-primary-700 px-3 pr-5 font-semibold text-md text-gomin-primary-700 shadow-none hover:bg-gomin-primary-100 hover:text-gomin-primary-700"
          >
            <ScanTextIcon
              ref={rewardQrIconRef}
              size={22}
              animateOnHover={false}
              className="flex size-[22px] shrink-0 items-center justify-center text-current [&_svg]:!h-[22px] [&_svg]:!w-[22px]"
            />
            리워드 QR 확인
          </Button>
        )}
        <AdminUserInfo />
      </div>
      {eventId && isRewardQrOpen && (
        <RewardQrScannerClient
          eventId={Number(eventId)}
          open={isRewardQrOpen}
          onOpenChange={setIsRewardQrOpen}
        />
      )}
    </aside>
  );
};

export default Sidebar;
