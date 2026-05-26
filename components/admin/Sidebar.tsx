import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { getAdminSidebarItems } from '@/constants/adminRoutes';

interface SidebarProps {
  eventId: string;
  pathname: string;
}

const Sidebar = ({ eventId, pathname }: SidebarProps) => {
  const items = getAdminSidebarItems(eventId);

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-gomin-neutral-100 bg-gomin-white px-4 py-5">
      <div>
        <h1 className="text-xl font-semibold text-gomin-black">stamply</h1>
      </div>

      <div className="mt-8">
        <label
          htmlFor="admin-event-select"
          className="text-xs text-gomin-neutral-500"
        >
          현재 행사
        </label>
        <select
          id="admin-event-select"
          defaultValue={eventId}
          className="mt-2 w-full cursor-pointer rounded border border-gomin-primary-300 bg-gomin-primary-100 px-3 py-2 text-sm text-gomin-black "
        >
          <option value={eventId}>상상 팝업 페스타 2026</option>
          <option value="2027">송수 팝업 페스타 2027</option>
          <option value="2028">상수 팝업 페스타 2028</option>
        </select>
      </div>

      <nav className="mt-6 space-y-1 border-t border-gomin-neutral-100 pt-4">
        <p className="mb-2 text-xs text-gomin-neutral-500">메뉴</p>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm ${
                isActive
                  ? 'bg-gomin-primary-700 text-gomin-white'
                  : 'text-gomin-neutral-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gomin-neutral-100 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gomin-black">박지윤</p>
            <p className="text-xs text-gomin-neutral-500">jiyoon@stamply.kr</p>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded border border-gomin-neutral-200 p-2 text-gomin-neutral-600"
            aria-label="로그아웃"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
