import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getEntryEvent } from "@/features/qr/entry/api/entry";
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

  return (
    <BrochureClient images={event.brochureImageUrl} showGuide={!guideSeen} />
  );
};

export default BrochurePage;
