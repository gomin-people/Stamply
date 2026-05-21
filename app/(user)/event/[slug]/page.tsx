import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventPoster from '@/components/user/common/EventPoster';
import ThemedButton from '@/components/user/common/ThemedButton';
import EventThemeInitializer from '@/components/user/EventThemeInitializer';

type EventEntryPageProps = {
    params: Promise<{ slug: string }>;
}

type EntryResponseData = {
    event: {
        posterImageUrl: string;
        primaryColor: string | null;
    };
}

const EventEntryPage = async ({ params }: EventEntryPageProps) => {
    const { slug } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/qr/entry/${slug}`, {
        cache: 'no-store',
    });

    if (res.status === 404) notFound();
    if (!res.ok) throw new Error('행사 정보를 불러올 수 없습니다.');

    const { data }: { data: EntryResponseData } = await res.json();
    const { posterImageUrl, primaryColor } = data.event;

    return (
        <main className="min-h-screen bg-white flex justify-center">
            <EventThemeInitializer primaryColor={primaryColor} />
            <div className="w-full max-w-100.5 flex flex-col items-center px-12 pt-41 pb-10">
                <EventPoster src={posterImageUrl} width={300} height={440} />
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

export default EventEntryPage
