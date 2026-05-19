'use client'

import { useState } from 'react'
import StampCard from '@/components/sample/StampCard'

export default function Home() {
  const [isStamped, setIsStamped] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <StampCard isStamped={isStamped} className="w-32 h-32 border rounded-xl" />
      <button
        onClick={() => setIsStamped((prev) => !prev)}
        className="px-4 py-2 bg-violet-600 text-white rounded-lg"
      >
        {isStamped ? '스탬프 취소' : '스탬프 찍기'}
      </button>
    </div>
  )
}
