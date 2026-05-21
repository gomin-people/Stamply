import { notFound } from 'next/navigation';

type EntryEvent = {
    posterImageUrl: string;
    primaryColor: string | null;
}

export const getEntryEvent = async (token: string): Promise<EntryEvent> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/qr/entry/${token}`, {
        cache: 'no-store',
    });

    if (res.status === 404) notFound();
    if (!res.ok) throw new Error('행사 정보를 불러올 수 없습니다.');

    const { data } = await res.json();
    return data.event;
}
