'use client'

import { useState } from 'react'
import Image from 'next/image'
import Card from '@/components/sample/Card'
import Modal from '@/components/sample/Modal'
import Button from '@/components/sample/Button'

type Mission = {
  id: number
  title: string
  description: string
  isStamped: boolean
}

const MissionItem = ({ mission }: { mission: Mission }) => {
  const [enable, setEnable] = useState(false)

  return (
    <>
      <Card
        className="flex items-center gap-4 cursor-pointer bg-gomin-primary-700/10 border-0 shadow-none w-75 h-26"
        onClick={() => setEnable(true)}
      >
        <div className="w-20 h-20 shrink-0 relative">
          <Image src="/images/icon_stamply.svg" alt="stamp" fill className="object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{mission.title}</span>
          <span className="text-sm text-gray-500">{mission.description}</span>
        </div>
      </Card>

      <Modal enable={enable} onClose={() => setEnable(false)}>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-lg">{mission.title}</p>
          <p className="text-gray-500 text-sm">{mission.description}</p>
          <p className="text-sm mt-2">
            {mission.isStamped ? '✅ 완료된 미션이에요' : '⬜ 아직 완료 안 된 미션이에요'}
          </p>
          <Button className="mt-4 w-full py-3 rounded-xl" onClick={() => setEnable(false)}>
            닫기
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default MissionItem
