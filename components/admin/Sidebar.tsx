import { getAdminSidebarItems } from '@/constants/adminRoutes';
import EventSelector from './EventSelector';
import SidebarNav from './SidebarNav';
import AdminUserInfo from '@/components/admin/AdminUserInfo';

interface SidebarProps {
  eventId: string;
  pathname: string;
}

const Sidebar = ({ eventId, pathname }: SidebarProps) => {
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
