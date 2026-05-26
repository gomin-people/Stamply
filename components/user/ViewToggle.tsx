'use client'

import { Menu, LayoutGrid } from 'lucide-react'

type ViewMode = 'list' | 'grid'

interface ViewToggleProps {
  viewMode: ViewMode
  onChange: (mode: ViewMode) => void
}

export default function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-3">
      {/* 리스트 뷰 버튼 */}
      <button
        onClick={() => onChange('list')}
        className={`p-1 rounded-md transition-colors active:scale-95 duration-200 ${
          viewMode === 'list'
            ? 'text-gomin-primary-700'
            : 'text-gomin-neutral-400 hover:text-gomin-neutral-600'
        }`}
        aria-label="리스트 보기"
      >
        <Menu className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* 스탬프/그리드 뷰 버튼 */}
      <button
        onClick={() => onChange('grid')}
        className={`p-1 rounded-md transition-colors active:scale-95 duration-200 ${
          viewMode === 'grid'
            ? 'text-gomin-primary-700'
            : 'text-gomin-neutral-400 hover:text-gomin-neutral-600'
        }`}
        aria-label="스탬프 격자 보기"
      >
        <LayoutGrid className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  )
}
