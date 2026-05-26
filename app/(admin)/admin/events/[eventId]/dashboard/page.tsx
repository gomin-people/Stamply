interface DashboardPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { eventId } = await params;

  return <div>행사 {eventId} 대시보드</div>;
}
