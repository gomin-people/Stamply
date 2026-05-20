import { Suspense } from 'react'
import Button from '@/components/sample/Button'
import MissionList from '@/components/user/MissionList'
import Skeleton from '@/components/sample/Skeleton'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto px-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between py-4">
        <span className="text-2xl font-bold text-gomin-primary-700">Stamply</span>
        <button className="p-2 rounded-lg border border-gray-200">
          <span className="text-gray-500">☰</span>
        </button>
      </div>

      {/* 안내 텍스트 */}
      <div className="py-4">
        <p className="text-lg font-bold">🎉 예시코드입니다.</p>
        <p className="text-lg font-bold">실제코드가 아닙니다.</p>
      </div>

      {/* 미션 리스트 */}
      <Suspense fallback={
        <div className="flex flex-col gap-3 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-75 h-26" />
          ))}
        </div>
      }>
        <MissionList />
      </Suspense>

      {/* 하단 버튼 */}
      <div className="py-6">
        <Button className="w-full py-4 rounded-xl text-base font-semibold">
          샘플코드
        </Button>
      </div>
    </div>
  )
}

export default Home
