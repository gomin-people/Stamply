import { cookies } from "next/headers";
import { getEntryEvent } from "@/features/qr/entry/api/entry";
import BrochureClient from "@/components/user/brochure/BrochureClient";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ from?: string }>;
};

const BrochurePage = async ({ params, searchParams }: Props) => {
  const { eventId } = await params;
  const { from } = await searchParams;

  const event = await getEntryEvent(eventId);

  if (!event.brochureImageUrl?.length) {
    redirect(`/event/${eventId}/${from === "mission" ? "detail" : "mission"}`);
  }

  const cookieStore = await cookies();
  const showGuide = !cookieStore.has(`brochure-guide-seen-${eventId}`);

  return (
    <BrochureClient images={event.brochureImageUrl} showGuide={showGuide} />
  );
};

export default BrochurePage;
