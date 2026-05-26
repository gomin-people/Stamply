'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  adminEventOptions,
  getAdminEventOption,
  type AdminEventStatus,
} from '@/constants/adminEventMocks';
import { cn } from '@/utils';

interface EventSelectorProps {
  eventId: string;
}

// 행사 상태 배지 색상 클래스
const getStatusBadgeClassName = (status: AdminEventStatus) =>
  cn(
    'shrink-0 rounded-full px-2 py-1 text-xs font-medium',
    status === '진행중'
      ? 'bg-gomin-primary-200 text-gomin-primary-600'
      : 'bg-gomin-neutral-100 text-gomin-neutral-500'
  );

// 관리자 사이드바 현재 행사 선택 커스텀 드롭다운 및 애니메이션 컴포넌트
export default function EventSelector({ eventId }: EventSelectorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const eventMenuRef = useRef<HTMLDivElement>(null);
  const routeEventId =
    getAdminEventOption(eventId)?.id ?? adminEventOptions[0].id;
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(routeEventId);
  const selectedEvent =
    adminEventOptions.find((event) => event.id === selectedEventId) ??
    adminEventOptions[0];

  // 행사 선택 메뉴 닫기
  const closeEventMenu = () => {
    setIsEventMenuOpen(false);
  };

  // 선택 행사 변경 및 라우트 이동
  const selectEvent = (nextEventId: string) => {
    setSelectedEventId(nextEventId);
    closeEventMenu();

    if (nextEventId !== eventId) {
      router.push(
        pathname.replace(
          `/admin/events/${eventId}`,
          `/admin/events/${nextEventId}`
        )
      );
    }
  };

  useEffect(() => {
    if (!isEventMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!eventMenuRef.current?.contains(event.target as Node)) {
        closeEventMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeEventMenu();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEventMenuOpen]);

  return (
    <div className="mt-8" ref={eventMenuRef}>
      <label
        htmlFor="admin-event-select"
        className="text-xs text-gomin-neutral-500"
      >
        현재 행사
      </label>
      <div className="relative mt-2">
        <button
          id="admin-event-select"
          type="button"
          className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl border border-gomin-primary-300 bg-gomin-primary-100 px-3 text-sm font-semibold text-gomin-black transition-colors hover:border-gomin-primary-400 hover:bg-gomin-primary-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          aria-haspopup="listbox"
          aria-expanded={isEventMenuOpen}
          aria-controls="admin-event-options"
          onClick={() => setIsEventMenuOpen((isOpen) => !isOpen)}
        >
          <span className="max-w-full truncate">{selectedEvent.title}</span>
        </button>

        <AnimatePresence>
          {isEventMenuOpen && (
            <motion.div
              key="admin-event-options"
              initial={{ opacity: 0, scaleY: 0.94, y: -10 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              exit={{ opacity: 0, scaleY: 0.96, y: -8 }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 34,
                mass: 0.7,
              }}
              style={{ originY: 0 }}
              className="absolute top-full left-0 z-30 mt-3 w-full rounded-xl"
            >
              <div className="rounded-xl border border-gomin-neutral-200 bg-gomin-white p-2 shadow-md">
                <ul
                  id="admin-event-options"
                  role="listbox"
                  aria-labelledby="admin-event-select"
                  className="space-y-1"
                >
                  {adminEventOptions.map((event) => {
                    const isSelected = event.id === selectedEventId;

                    return (
                      <li key={event.id} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          className="flex h-13 w-full cursor-pointer items-center justify-between gap-1.5 rounded-lg px-1.5 text-left transition-colors hover:bg-gomin-neutral-100 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                          onClick={() => selectEvent(event.id)}
                        >
                          <span
                            className={cn(
                              'min-w-0 truncate text-sm font-semibold',
                              isSelected
                                ? 'text-gomin-black'
                                : 'text-gomin-neutral-500'
                            )}
                          >
                            {event.title}
                          </span>
                          <span
                            className={getStatusBadgeClassName(event.status)}
                          >
                            {event.status}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <button
                  type="button"
                  className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-gomin-neutral-300 text-sm font-semibold text-gomin-white transition-colors hover:bg-gomin-neutral-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <Plus className="h-5 w-5" aria-hidden="true" />
                  <span>새 행사 만들기</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
