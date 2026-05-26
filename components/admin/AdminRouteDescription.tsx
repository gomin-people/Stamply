import type { AdminRouteDescriptionSegment } from '@/constants/adminRoutes';

interface AdminRouteDescriptionProps {
  description: AdminRouteDescriptionSegment[];
  eventTitle?: string;
}

// 관리자 헤더 설명
export default function AdminRouteDescription({
  description,
  eventTitle,
}: AdminRouteDescriptionProps) {
  return (
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
  );
}
