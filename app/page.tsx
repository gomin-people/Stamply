'use client'

import { useState } from 'react'
import Image from 'next/image'
import Button from '@/components/sample/Button'
import Card from '@/components/sample/Card'
import Skeleton from '@/components/sample/Skeleton'
import Modal from '@/components/sample/Modal'

const MISSIONS = [
  { id: 1, title: '미션 1', description: '점심먹기 워먹지 배고프다', isStamped: true },
  { id: 2, title: '미션 1', description: '점심먹기 워먹지 배고프다', isStamped: true },
  { id: 3, title: '미션 1', description: '점심먹기 워먹지 배고프다', isStamped: true },
  { id: 4, title: '미션 1', description: '점심먹기 워먹지 배고프다', isStamped: false },
]

export default function Home() {
  const [enable, setEnable] = useState(false)
  const [selected, setSelected] = useState<typeof MISSIONS[0] | null>(null)
  const [isLoading] = useState(false)

  const handleOpen = (mission: typeof MISSIONS[0]) => {
    setSelected(mission)
    setEnable(true)
  }

  const handleClose = () => {
    setEnable(false)
  }

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
        <p className="text-lg font-bold">🎉 축하합니다!</p>
        <p className="text-lg font-bold">모든 스탬프를 수집했어요!</p>
      </div>

      {/* 미션 리스트 */}
      <div className="flex flex-col gap-3 flex-1">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))
          : MISSIONS.map((mission) => (
              <Card
                key={mission.id}
                className="flex items-center gap-4 cursor-pointer bg-gomin-primary-700/10 border-0 shadow-none"
                onClick={() => handleOpen(mission)}
              >
                <div className="w-20 h-20 shrink-0 relative">
                  <Image src="/images/icon_stamply.svg" alt="stamp" fill className="object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">{mission.title}</span>
                  <span className="text-sm text-gray-500">{mission.description}</span>
                </div>
              </Card>
            ))}
      </div>

      {/* 하단 버튼 */}
      <div className="py-6">
        <Button className="w-full py-4 rounded-xl text-base font-semibold">
          QR 체크하기
        </Button>
      </div>

      {/* 모달 */}
      <Modal enable={enable} onClose={handleClose}>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg">{selected?.title}</p>
          <p className="text-gray-500 text-sm">{selected?.description}</p>
          <p className="text-sm mt-2">
            {selected?.isStamped ? '✅ 완료된 미션이에요' : '⬜ 아직 완료 안 된 미션이에요'}
          </p>
          <Button className="mt-4 w-full py-3 rounded-xl" onClick={handleClose}>
            닫기
          </Button>
        </div>
      </Modal>
    </div>
  )
}
