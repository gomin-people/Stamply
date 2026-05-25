import BrochureClientPage from './BrochureClientPage'

const images = [
  '/images/image_brochure.png',
  '/images/image_brochure2.png',
  '/images/image_brochure3.png'
]

type PageProps = {
  params: Promise<{ eventId: string }>
  searchParams: Promise<{ from?: string }>
}

const BrochurePage = async ({ params, searchParams }: PageProps) => {
  const { eventId } = await params
  const { from } = await searchParams
  const fromMission = from === 'mission'

  return (
    <BrochureClientPage
      images={images}
      eventId={eventId}
      fromMission={fromMission}
    />
  )
}

export default BrochurePage
