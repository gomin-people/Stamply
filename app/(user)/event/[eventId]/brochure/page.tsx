import { getEntryEvent } from "@/features/qr/entry/api/entry";
import BrochureClient from "@/components/user/brochure/BrochureClient";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ eventId: string }>;
};

const BrochurePage = async ({ params }: Props) => {
  const { eventId } = await params;

  const event = await getEntryEvent(eventId);

  if (!event.brochureImageUrl?.length) {
    redirect(`/event/${eventId}/mission`);
  }

  return <BrochureClient images={event.brochureImageUrl} />;
};

export default BrochurePage;
