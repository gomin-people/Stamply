import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getEntryEvent } from "@/features/qr/entry/api/entry";
import { participantEventQueryOptions } from "@/features/participant/events/participantEventOptions";
import BrochureClient from "@/components/user/brochure/BrochureClient";

type Props = {
  params: Promise<{ eventId: string }>;
};

const BrochurePage = async ({ params }: Props) => {
  const { eventId } = await params;

  const event = await getEntryEvent(eventId);

  if (!event.brochureImageUrl?.length) {
    redirect(`/event/${eventId}/mission`);
  }

  const cookieStore = await cookies();
  const guideSeen = cookieStore.has(`brochure-guide-seen-${eventId}`);

  const queryClient = new QueryClient();
  queryClient.setQueryData(
    participantEventQueryOptions(Number(eventId)).queryKey,
    event
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrochureClient showGuide={!guideSeen} />
    </HydrationBoundary>
  );
};

export default BrochurePage;
