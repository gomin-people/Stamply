import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchAdminEvent } from "@/features/admin/events/adminEventQueries";
import EventEditClient from "@/components/admin/event/edit/EventEditClient";

export default async function EventEditPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const eventId = await params.then(({ eventId }) => Number(eventId));

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin", "events", "detail", eventId],
    queryFn: () => fetchAdminEvent(eventId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventEditClient />
    </HydrationBoundary>
  );
}
