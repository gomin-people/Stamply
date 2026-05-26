'use client'

import Link from 'next/link'
import { Newspaper } from 'lucide-react'

interface BrochureButtonProps {
  eventId: string
}

export default function BrochureButton({ eventId }: BrochureButtonProps) {
  return (
    <Link
      href={`/event/${eventId}/brochure`}
      className="flex items-center justify-center w-12 h-12 shrink-0 rounded-full border-2 border-gomin-primary-700 bg-gomin-white text-gomin-primary-700 hover:bg-gomin-primary-100/50 active:scale-95 transition-all duration-200 shadow-sm"
      aria-label="브로슈어 안내장 보기"
    >
      <Newspaper className="w-5 h-5" />
    </Link>
  )
}
