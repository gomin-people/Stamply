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

  return <BrochureClient images={event.brochureImageUrl} />;
};

export default BrochurePage;
