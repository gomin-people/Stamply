import Link from 'next/link'

interface PageProps {
  params: Promise<{ eventId: string }>
}

export default async function MissionPage({ params }: PageProps) {
  const { eventId } = await params

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-[calc(100vh-56px)] bg-gomin-white">
      <div className="max-w-md w-full space-y-6">
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-gomin-primary-700 bg-gomin-primary-100 rounded-full">
            STEP 2. 스탬프 미션 진행
          </span>
          <h2 className="text-2xl font-black text-gomin-black">
            미션을 완료해 주세요
          </h2>
          <p className="text-sm text-gomin-neutral-500">
            현장에 마련된 부스 스태프에게 화면을 보여주고<br />
            스탬프 적립을 요청해 보세요!
          </p>
        </div>

        {/* 가상 스탬프 적립 박스 */}
        <div className="flex justify-center gap-4 py-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gomin-primary-100 text-gomin-primary-700 border border-dashed border-gomin-primary-300 font-bold text-lg">
            ✓
          </div>
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gomin-primary-100 text-gomin-primary-700 border border-dashed border-gomin-primary-300 font-bold text-lg">
            ✓
          </div>
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gomin-neutral-100 text-gomin-neutral-300 border border-dashed border-gomin-neutral-300 font-bold text-lg">
            3
          </div>
        </div>

        <div className="pt-4">
          <Link
            href={`/event/${eventId}/complete`}
            className="inline-flex w-full items-center justify-center h-12 px-6 font-bold text-white bg-gomin-primary-700 hover:bg-gomin-primary-600 rounded-xl transition-all duration-200 shadow-md shadow-gomin-primary-700/20 active:scale-[0.98]"
          >
            스탬프 적립 최종 완료하기
          </Link>
        </div>
      </div>
    </div>
  )
}
