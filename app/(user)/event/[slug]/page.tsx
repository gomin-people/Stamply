import Link from 'next/link';
import EventPoster from '@/components/user/common/EventPoster';
import ThemedButton from '@/components/user/common/ThemedButton';

interface EventEntryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventEntryPage({ params }: EventEntryPageProps) {
  const { slug } = await params;

  // TODO: slug로 행사 데이터 조회 (백엔드 연동 시)
  const posterSrc = '/images/poster.png';

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-100.5 flex flex-col items-center px-12 pt-41 pb-10">
        <EventPoster src={posterSrc} width={300} height={440} />
        <Link href={`/event/${slug}/brochure`} className="mt-5.5 w-full max-w-76">
          <ThemedButton className="w-full">시작하기</ThemedButton>
        </Link>
        <p className="font-sans text-sm font-bold leading-normal text-gomin-neutral-500 whitespace-nowrap pt-2.5">
          powered by stamply
        </p>
      </div>
    </main>
  );
}
