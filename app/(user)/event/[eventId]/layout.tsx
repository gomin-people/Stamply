import { notFound } from 'next/navigation'
import { getEventPrimaryColor, validateEvent } from '@/utils/api'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ eventId: string }>
}

export default async function EventLayout({ children, params }: LayoutProps) {
  const { eventId: eventIdParam } = await params

  const [isValid, primaryColor] = await Promise.all([
    validateEvent(eventIdParam),
    getEventPrimaryColor(eventIdParam),
  ])

  if (!isValid) {
    return notFound()
  }

  return (
    <div style={{ '--primary-color': primaryColor ?? '#5435EB' } as React.CSSProperties}>
      {children}
    </div>
  )
}
