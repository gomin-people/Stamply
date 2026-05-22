import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventPoster from '@/components/user/common/EventPoster';
import ThemedButton from '@/components/user/common/ThemedButton';
import EventThemeInitializer from '@/components/user/EventThemeInitializer';
import { enterEventByToken, type EntryResult } from '@/features/qr/entry/api/entryApi';
import { ApiError } from '@/features/shared/api/http';

type EventEntryPageProps = {
    params: Promise<{ eventId: string }>;
}

const EventEntryPage = async ({ params }: EventEntryPageProps) => {
    const { eventId } = await params;

    let entryResult: EntryResult;
    try {
        entryResult = await enterEventByToken(eventId);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) notFound();
        throw error;
    }

    const { posterImageUrl, primaryColor } = entryResult.event;

    return (
        <main className="min-h-screen bg-white flex justify-center">
            <EventThemeInitializer primaryColor={primaryColor} />
            <div className="w-full max-w-100.5 flex flex-col items-center px-12 pt-41 pb-10">
                <EventPoster src={posterImageUrl} width={300} height={440} />
                <Link href={`/event/${eventId}/brochure`} className="mt-5.5 w-full max-w-76">
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
