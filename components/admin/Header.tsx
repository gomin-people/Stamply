'use client';

import type { AdminRouteDescriptionSegment } from '@/constants/adminRoutes';
import AdminRouteDescription from './AdminRouteDescription';

interface HeaderProps {
  title?: string;
  description?: AdminRouteDescriptionSegment[];
  eventTitle?: string;
}

const Header = ({ title, description, eventTitle }: HeaderProps) => {
  return (
    <header className="relative flex w-full flex-col px-4 pt-6 pl-8">
      <h1 className="text-xl font-semibold text-gomin-black">{title}</h1>
      {description && (
        <AdminRouteDescription
          description={description}
          eventTitle={eventTitle}
        />
      )}
    </header>
  );
};

export default Header;
