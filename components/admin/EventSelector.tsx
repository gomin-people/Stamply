'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import {
  adminEventOptions,
  getAdminEventOption,
  type AdminEventStatus,
} from '@/constants/adminEventMocks';
import { cn } from '@/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EventSelectorProps {
  eventId: string;
}

const getStatusBadgeClassName = (status: AdminEventStatus) =>
  cn(
    status === '진행중'
      ? 'bg-gomin-primary-200 text-gomin-primary-600'
      : 'bg-gomin-neutral-100 text-gomin-neutral-500'
  );

export default function EventSelector({ eventId }: EventSelectorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const routeEventId =
    getAdminEventOption(eventId)?.id ?? adminEventOptions[0].id;
  const selectedEvent =
    adminEventOptions.find((event) => event.id === routeEventId) ??
    adminEventOptions[0];

  const selectEvent = (nextEventId: string) => {
    if (nextEventId !== eventId) {
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
          <button
            id="admin-event-select"
            type="button"
            className="mt-2 flex h-14 w-full cursor-pointer items-center justify-center rounded-xl border border-gomin-primary-300 bg-gomin-primary-100 px-3 text-sm font-semibold text-gomin-black transition-colors hover:border-gomin-primary-400 hover:bg-gomin-primary-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <span className="max-w-full truncate">{selectedEvent.title}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={12}
          className="rounded-xl border-gomin-neutral-200 bg-gomin-white p-2"
        >
          {adminEventOptions.map((event) => {
            const isSelected = event.id === routeEventId;

            return (
              <DropdownMenuItem
                key={event.id}
                data-selected={isSelected}
                className="flex h-13 cursor-pointer items-center justify-between gap-1.5 rounded-lg px-1.5 text-left transition-colors focus:bg-gomin-neutral-100 data-[selected=true]:text-gomin-black"
                onSelect={() => selectEvent(event.id)}
              >
                <span
                  className={cn(
                    'min-w-0 truncate text-sm font-semibold',
                    isSelected ? 'text-gomin-black' : 'text-gomin-neutral-500'
                  )}
                >
                  {event.title}
                </span>
                <Badge className={getStatusBadgeClassName(event.status)}>
                  {event.status}
                </Badge>
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator className="my-2 bg-gomin-neutral-100" />
          <DropdownMenuItem className="flex h-12 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-gomin-neutral-300 text-sm font-semibold text-gomin-white transition-colors focus:bg-gomin-neutral-400 focus:text-gomin-white focus:**:text-gomin-white">
            <Plus className="h-5 w-5" aria-hidden="true" />
            <span>새 행사 만들기</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
