'use client';

import type { AdminRouteDescriptionSegment } from '@/constants/adminRoutes';

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
        <p className="mt-2 text-sm text-gomin-neutral-500">
          {description.map((segment, index) => {
            if (segment.type === 'eventTitle') {
              return (
                <strong
                  key={`${segment.type}-${index}`}
                  className="font-bold text-gomin-black"
                >
                  {eventTitle}
                </strong>
              );
            }

            return <span key={`${segment.type}-${index}`}>{segment.text}</span>;
          })}
        </p>
      )}
    </header>
  );
};

export default Header;
