type BrochureIndicatorProps = {
  total: number
  currentIndex: number
}

const BrochureIndicator = ({ total, currentIndex }: BrochureIndicatorProps) => {
  if (total <= 1) return null

  const count = Math.min(total, 10)

  return (
    <div className="flex gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`w-20 h-1.5 rounded-[10px] transition-colors duration-300 ${
            index === currentIndex ? 'bg-gomin-primary-700' : 'bg-gomin-neutral-300'
          }`}
        />
      ))}
    </div>
  )
}

export default BrochureIndicator
