import Link from 'next/link'

type BrochureEventButtonProps = {
  eventId: string
}

const BrochureEventButton = ({ eventId }: BrochureEventButtonProps) => {
  return (
    <Link
      // 행사 상세 페이지가 들어가야합니다. 우진님이 상세 페이지 생성 후 바꿔주시면 됩니다. 
      href={`/event/${eventId}`}
      className="mt-4 w-71.75 h-10.75 bg-gomin-neutral-600 rounded-[20px] text-gomin-white font-bold text-sm flex items-center justify-center"
    >
      행사 상세 정보
    </Link>
  )
}

export default BrochureEventButton
