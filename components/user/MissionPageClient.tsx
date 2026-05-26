'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BrochureButton from '@/components/user/BrochureButton'
import ViewToggle from '@/components/user/ViewToggle'
import MissionStamp from '@/components/user/MissionStamp'
import MissionItem from '@/components/user/MissionItem'
import FloatingActionButton from '@/components/user/FloatingActionButton'

// Supabase의 event 테이블 타입 인터페이스 정의
interface EventData {
  id: number
  title?: string
  name?: string
  description?: string
  [key: string]: any
}

interface MissionPageClientProps {
  event: EventData
  eventId: string
}

type ViewMode = 'list' | 'grid'

export default function MissionPageClient({ event, eventId }: MissionPageClientProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  
  // 체험을 위한 가상 미션 데이터 세트
  const [missions, setMissions] = useState([
    { id: 1, title: '미션 1', description: '점심먹기 뭐먹지 배고프다', isStamped: true },
    { id: 2, title: '미션 1', description: '점심먹기 뭐먹지 배고프다', isStamped: true },
    { id: 3, title: '미션 1', description: '점심먹기 뭐먹지 배고프다', isStamped: true },
    { id: 4, title: '미션 1', description: '점심먹기 뭐먹지 배고프다', isStamped: false },
    { id: 5, title: '미션 1', description: '점심먹기 뭐먹지 배고프다', isStamped: false },
    { id: 6, title: '미션 1', description: '점심먹기 뭐먹지 배고프다', isStamped: false },
  ])

  // 미완료된 미션 수 계산
  const incompleteCount = missions.filter((m) => !m.isStamped).length
  const isAllCompleted = incompleteCount === 0

  // QR 체크 가상 시뮬레이션
  const handleAction = () => {
    if (isAllCompleted) {
      router.push(`/event/${eventId}/complete`)
    } else {
      const firstIncompleteIndex = missions.findIndex((m) => !m.isStamped)
      if (firstIncompleteIndex !== -1) {
        const updated = [...missions]
        updated[firstIncompleteIndex].isStamped = true
        setMissions(updated)
      }
    }
  }

  // DB에서 불러온 title (또는 name)을 1순위로 사용하며 예외 처리 제공
  const eventName = event?.title || event?.name || `이벤트 #${eventId}`

  return (
    <div className="flex flex-col min-h-screen bg-gomin-white pb-28">
      <main className="flex-1 max-w-md w-full mx-auto px-6 pt-4">
        {/* 2. 타이틀 & 브로슈어 안내장 버튼 레이아웃 */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <h1 className="text-4xl font-black text-gomin-primary-700 tracking-tight select-none">
            {eventName}
          </h1>
          {/* 우측 별도 컴포넌트로 보여지는 브로슈어 버튼 */}
          <BrochureButton eventId={eventId} />
        </div>

        {/* 3. 진행 상황 안내 문구 */}
        <div className="mb-8 min-h-[56px] flex items-center">
          {!isAllCompleted ? (
            <h2 className="text-2xl font-black text-gomin-black leading-tight tracking-tight select-none">
              <span className="text-gomin-primary-700 font-extrabold">{incompleteCount}개</span>의 스탬프를 더 모으고
              <br />
              리워드를 받으세요
            </h2>
          ) : (
            <h2 className="text-2xl font-black text-gomin-black leading-tight tracking-tight flex items-center gap-1.5 select-none animate-bounce">
              🎉 축하합니다!
              <br />
              모든 스탬프를 수집했어요!
            </h2>
          )}
        </div>

        {/* 4. UI 선택 토글 버튼 (리스트형 vs 격자형) */}
        <div className="flex justify-end mb-5">
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>

        {/* 5. 미션 뷰 렌더링 영역 */}
        <div className="transition-all duration-300">
          {viewMode === 'grid' ? (
            /* 스탬프 뷰: 격자형 정사각형 카드 */
            <div className="grid grid-cols-2 gap-4">
              {missions.map((mission) => (
                <MissionStamp key={mission.id} mission={mission} />
              ))}
            </div>
          ) : (
            /* 리스트 뷰: 가로형 카드 */
            <div className="flex flex-col gap-4">
              {missions.map((mission) => (
                <MissionItem key={mission.id} mission={mission} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 6. 하단 고정 플로팅 액션 버튼 */}
      <FloatingActionButton
        isAllCompleted={isAllCompleted}
        onClick={handleAction}
      />
    </div>
  )
}
