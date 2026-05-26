import Link from 'next/link';

interface EventDetailPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { eventId } = await params;

  return (
    <div>
      <p>행사 {eventId} 상세</p>
    </div>
  );
}
