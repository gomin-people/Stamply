import EventFormStepper from '@/components/admin/Event/EventFormStepper';
import EventFormFooter from '@/components/admin/Event/EventFormFooter';

type Props = {
  params: Promise<{ eventId: string }>;
};

export default async function EventEditPage({ params }: Props) {
  const { eventId } = await params;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gomin-black">행사 수정</h1>
        <p className="mt-1 text-sm text-gomin-neutral-400">
          행사 정보를 수정합니다. (ID: {eventId})
        </p>
      </div>

      <div className="rounded-xl border border-gomin-neutral-100 bg-white">
        <EventFormStepper currentStep={1} />

        <div className="p-8">
          {/* Step 1: 행사정보 · 포스터 */}
        </div>

        <div className="px-8 pb-8">
          <EventFormFooter currentStep={1} totalSteps={3} />
        </div>
      </div>
    </div>
  );
}
