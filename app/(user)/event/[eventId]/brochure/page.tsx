import { redirect } from "next/navigation";
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

  // 쿠키 검증 + 없으면 /qr-required 리다이렉트
  const event = await getEntryEvent(eventId);

  if (!event.brochureImageUrl?.length) {
    redirect(`/event/${eventId}/mission`);
  }

  const queryClient = new QueryClient();
  queryClient.setQueryData(
    participantEventQueryOptions(Number(eventId)).queryKey,
    event
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrochureClient />
    </HydrationBoundary>
  );
};

export default BrochurePage;
