"use client";

import { useParams, usePathname } from "next/navigation";
import { getAdminRouteConfig } from "@/constants/adminRoutes";
import { getAdminEventTitle } from "@/constants/adminEventMocks";

const Header = () => {
  const pathname = usePathname();
  const { eventId } = useParams<{ eventId?: string }>();
  const route = getAdminRouteConfig(pathname);
  const eventTitle = eventId ? getAdminEventTitle(eventId) : undefined;

  if (!route) {
    return null;
  }

  return (
    <header className="flex flex-col pt-6 pr-4 pl-8">
      <h1 className="text-xl font-semibold text-gomin-black">{route.title}</h1>
      {route.description && (
        <p className="mt-2 text-sm text-gomin-neutral-500">
          {route.description.map((segment, index) => {
            if (segment.type === "eventTitle") {
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
