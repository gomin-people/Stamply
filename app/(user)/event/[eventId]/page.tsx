import EntryClient from "@/components/user/entry/EntryClient";
import { getEntryEvent } from "@/features/qr/entry/api/entry";

type EventEntryPageProps = {
  params: Promise<{ eventId: string }>;
};

const EventEntryPage = async ({ params }: EventEntryPageProps) => {
  const { eventId } = await params;
  const event = await getEntryEvent(eventId);

  return (
    <EntryClient
      eventId={eventId}
      posterImageUrl={event.posterImageUrl}
      hasBrochure={!!event.brochureImageUrl?.length}
    />
  );
};

export default EventEntryPage;
