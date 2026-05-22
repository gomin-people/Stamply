import Link from 'next/link'

interface PageProps {
  params: Promise<{ eventId: string }>
}

export default async function BrochurePage({ params }: PageProps) {
  const { eventId } = await params

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-[calc(100vh-56px)] bg-gomin-white">
      <div className="max-w-md w-full space-y-6">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-gomin-primary-700 bg-gomin-primary-100 rounded-full">
            STEP 1. 브로슈어 안내
          </span>
          <h2 className="text-2xl font-black text-gomin-black">
            행사 안내장
          </h2>
          <div className="p-5 border border-gomin-neutral-200 rounded-2xl bg-gomin-neutral-100 text-left space-y-3">
            <h3 className="font-bold text-gomin-black">📖 {eventId.toUpperCase()} 즐기기</h3>
            <ul className="text-xs text-gomin-neutral-500 space-y-2 list-disc list-inside">
              <li>행사 부스를 방문하여 퀴즈를 풀어보세요.</li>
              <li>스탬프를 획득하여 푸짐한 리워드를 받아가세요.</li>
              <li>주변의 맛집 제휴 혜택도 놓치지 마세요!</li>
            </ul>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href={`/event/${eventId}/mission`}
            className="inline-flex w-full items-center justify-center h-12 px-6 font-bold text-white bg-gomin-primary-700 hover:bg-gomin-primary-600 rounded-xl transition-all duration-200 shadow-md shadow-gomin-primary-700/20 active:scale-[0.98]"
          >
            안내 확인 완료 & 미션 시작하기
          </Link>
        </div>
      </div>
    </div>
  )
}
