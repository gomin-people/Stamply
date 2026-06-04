import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import DashboardClient from "@/components/admin/dashboard/DashboardClient";
import {
  fetchAdminDashboardAchieverStatistics,
  fetchAdminDashboardKpis,
  fetchAdminDashboardMissions,
  fetchAdminDashboardParticipantAnalysis,
} from "@/features/admin/dashboard/adminDashboardApi";
import { adminDashboardQueryKeys } from "@/constants/adminDashboardQueryKeys";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const eventId = await params.then(({ eventId }) => Number(eventId));
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: adminDashboardQueryKeys.kpis(eventId),
      queryFn: () => fetchAdminDashboardKpis(eventId),
    }),
    queryClient.prefetchQuery({
      queryKey: adminDashboardQueryKeys.participantAnalysis(eventId),
      queryFn: () => fetchAdminDashboardParticipantAnalysis(eventId),
    }),
    queryClient.prefetchQuery({
      queryKey: adminDashboardQueryKeys.achieverStatistics(eventId),
      queryFn: () => fetchAdminDashboardAchieverStatistics(eventId),
    }),
    queryClient.prefetchQuery({
      queryKey: adminDashboardQueryKeys.missions(eventId),
      queryFn: () => fetchAdminDashboardMissions(eventId),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient eventId={eventId} />
    </HydrationBoundary>
  );
}
