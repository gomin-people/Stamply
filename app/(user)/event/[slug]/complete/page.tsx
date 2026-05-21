import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CompletePage({ params }: PageProps) {
  const { slug } = await params

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-[calc(100vh-56px)] bg-gomin-white">
      <div className="max-w-md w-full space-y-6">
        <div className="space-y-2">
          <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4">
            🎉
          </div>
          <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full">
            축하합니다! 챌린지 성공
          </span>
          <h2 className="text-2xl font-black text-gomin-black">
            챌린지 최종 완료!
          </h2>
          <p className="text-sm text-gomin-neutral-500">
            {slug.toUpperCase()} 스탬프 투어를 무사히 마치셨습니다.<br />
            아래 버튼을 눌러 발급된 리워드 쿠폰을 확인해 보세요.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center h-12 px-6 font-bold text-white bg-gomin-primary-700 hover:bg-gomin-primary-600 rounded-xl transition-all duration-200 shadow-md shadow-gomin-primary-700/20 active:scale-[0.98]"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
