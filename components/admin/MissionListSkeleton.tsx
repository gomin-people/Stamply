import { Skeleton } from '@/components/ui/skeleton';

const GRID = '40px 60px 1fr 2fr 110px 72px 90px';

export default function MissionListSkeleton() {
  return (
    <div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="grid items-center px-6 py-5 border-b border-gomin-neutral-100 last:border-b-0"
          style={{ gridTemplateColumns: GRID }}
        >
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-6 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="mx-auto h-5 w-10 rounded-full" />
          <Skeleton className="mx-auto size-7 rounded" />
          <div className="flex justify-center gap-1">
            <Skeleton className="size-7 rounded" />
            <Skeleton className="size-7 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
