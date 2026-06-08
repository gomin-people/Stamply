import { getEntryEvent } from "@/features/qr/entry/api/entry";
import EntryPageClient from "@/components/user/entry/EntryPageClient";

type EventEntryPageProps = {
  params: Promise<{ eventId: string }>;
};

const EventEntryPage = async ({ params }: EventEntryPageProps) => {
  const { eventId } = await params;
  const event = await getEntryEvent(eventId);

  return (
    <EntryPageClient eventId={eventId} posterImageUrl={event.posterImageUrl} />
  );
};

export default EventEntryPage;
