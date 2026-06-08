import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getEntryEvent } from "@/features/qr/entry/api/entry";
import { participantEventQueryOptions } from "@/features/participant/events/participantEventOptions";
import EntryPageClient from "@/components/user/entry/EntryPageClient";

type EventEntryPageProps = {
  params: Promise<{ eventId: string }>;
};

const EventEntryPage = async ({ params }: EventEntryPageProps) => {
  const { eventId } = await params;

  const event = await getEntryEvent(eventId);

  const queryClient = new QueryClient();
  queryClient.setQueryData(
    participantEventQueryOptions(Number(eventId)).queryKey,
    event
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EntryPageClient eventId={eventId} />
    </HydrationBoundary>
  );
};

export default EventEntryPage;
