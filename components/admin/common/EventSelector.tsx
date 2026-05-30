"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminEventsQuery } from "@/features/admin/events/adminEventQueries";
import type { StamplyEvent } from "@/features/shared/types/stamply";
import { useSetSelectedEventId } from "@/stores/admin";

interface EventSelectorProps {
  eventId: string;
}

type AdminEventStatus = "진행중" | "예정" | "종료";

const getStatusBadgeClassName = (status: AdminEventStatus) =>
  cn(
    status === "진행중"
      ? "bg-gomin-primary-200 text-gomin-primary-600"
      : "bg-gomin-neutral-100 text-gomin-neutral-500"
  );

const getLocalDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
};

const getEventDateKey = (value: string) => value.slice(0, 10);

const getEventStatus = (
  event: Pick<StamplyEvent, "startDate" | "endDate">
): AdminEventStatus => {
  const today = getLocalDateKey();
  const startDate = getEventDateKey(event.startDate);
  const endDate = getEventDateKey(event.endDate);

  if (startDate <= today && today <= endDate) {
    return "진행중";
  }

  if (startDate > today) {
    return "예정";
  }

  return "종료";
};

const compareDateAsc = (firstDate: string, secondDate: string) =>
  getEventDateKey(firstDate).localeCompare(getEventDateKey(secondDate));

const compareDateDesc = (firstDate: string, secondDate: string) =>
  getEventDateKey(secondDate).localeCompare(getEventDateKey(firstDate));

const getEventSortPriority = (status: AdminEventStatus) => {
  if (status === "진행중") {
    return 1;
  }

  if (status === "예정") {
    return 2;
  }

  return 3;
};

const compareEventsByDisplayPriority = (
  firstEvent: StamplyEvent,
  secondEvent: StamplyEvent
) => {
  const firstStatus = getEventStatus(firstEvent);
  const secondStatus = getEventStatus(secondEvent);
  const priorityDiff =
    getEventSortPriority(firstStatus) - getEventSortPriority(secondStatus);

  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  if (firstStatus === "종료") {
    return compareDateDesc(firstEvent.endDate, secondEvent.endDate);
  }

  return compareDateAsc(firstEvent.startDate, secondEvent.startDate);
};

export default function EventSelector({ eventId }: EventSelectorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const setSelectedEventId = useSetSelectedEventId();
  const { data: events = [], isError, isLoading } = useAdminEventsQuery();
  const sortedEvents = useMemo(
    () => [...events].sort(compareEventsByDisplayPriority),
    [events]
  );
  const selectedEvent = events.find((event) => String(event.id) === eventId);
  const selectedEventLabel = isLoading
    ? "행사 불러오는 중"
    : isError
      ? "행사 목록 조회 실패"
      : (selectedEvent?.title ?? `행사 ${eventId}`);

  useEffect(() => {
    if (!selectedEvent) {
      return;
    }

    setSelectedEventId(String(selectedEvent.id));
  }, [selectedEvent, setSelectedEventId]);

  const selectEvent = (nextEventId: string) => {
    if (nextEventId !== eventId) {
      setSelectedEventId(nextEventId);

      router.push(
        pathname.replace(
          `/admin/events/${eventId}`,
          `/admin/events/${nextEventId}`
        )
      );
    }
  };

  return (
    <div className="mt-8">
      <label
        htmlFor="admin-event-select"
        className="text-xs text-gomin-neutral-500"
      >
        현재 행사
      </label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id="admin-event-select"
            type="button"
            variant="outline"
            className="mt-2 flex h-14 w-full cursor-pointer rounded-xl border-gomin-primary-300 bg-gomin-primary-100 px-3 font-semibold text-gomin-black transition-colors hover:border-gomin-primary-400 hover:bg-gomin-primary-200 focus-visible:ring-0"
          >
            <span className="max-w-full truncate">{selectedEventLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={12}
          className="rounded-xl bg-gomin-white p-2"
        >
          {sortedEvents.map((event) => {
            const nextEventId = String(event.id);
            const isSelected = nextEventId === eventId;
            const status = getEventStatus(event);

            return (
              <DropdownMenuItem
                key={event.id}
                data-selected={isSelected}
                className="h-13 cursor-pointer justify-between rounded-lg text-left transition-colors focus:bg-gomin-neutral-100"
                onSelect={() => selectEvent(nextEventId)}
              >
                <span
                  className={cn(
                    "min-w-0 truncate font-semibold",
                    isSelected ? "text-gomin-black" : "text-gomin-neutral-500"
                  )}
                >
                  {event.title}
                </span>
                <Badge className={getStatusBadgeClassName(status)}>
                  {status}
                </Badge>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator className="my-2 bg-gomin-neutral-100" />
          <DropdownMenuItem className="h-12 cursor-pointer justify-center rounded-lg bg-gomin-neutral-300 font-semibold text-gomin-white transition-colors focus:bg-gomin-neutral-400 focus:text-gomin-white focus:**:text-gomin-white">
            <Plus className="size-5" aria-hidden="true" />
            <span>새 행사 만들기</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
