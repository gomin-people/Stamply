import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchAdminMissions } from "@/features/admin/missions/adminMissionApi";
import MissionWrapper from "@/components/admin/mission/MissionWrapper";

export default async function MissionsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const eventId = await params.then(({ eventId }) => Number(eventId));

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin", "events", eventId, "missions"],
    queryFn: () => fetchAdminMissions(eventId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MissionWrapper eventId={eventId} />
    </HydrationBoundary>
  );
}
