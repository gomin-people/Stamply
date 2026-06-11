"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import BrochureSlider from "@/components/user/brochure/BrochureSlider";
import BrochureIndicator from "@/components/user/brochure/BrochureIndicator";
import BrochureEventButton from "@/components/user/brochure/BrochureEventButton";
import BrochureGuideOverlay from "@/components/user/brochure/BrochureGuideOverlay";
import FloatingActionButton from "@/components/user/mission/FloatingActionButton";

type Props = {
  images: string[];
  showGuide: boolean;
};

const BrochureClient = ({ images, showGuide }: Props) => {
  const { eventId } = useParams<{ eventId: string }>();
  const searchParams = useSearchParams();
  const fromMission = searchParams.get("from") === "mission";
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1));
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const isLastPage = images.length > 0 && currentIndex === images.length - 1;

  return (
    <div className="bg-gomin-white flex flex-col items-center pt-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] overflow-y-auto h-full">
      <div className="mb-4">
        <BrochureIndicator total={images.length} currentIndex={currentIndex} />
      </div>
      <BrochureSlider
        images={images}
        currentIndex={currentIndex}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {!fromMission && isLastPage && (
        <FloatingActionButton
          label="스탬프 투어 시작하기"
          onClick={() => router.push(`/event/${eventId}/mission`)}
        />
      )}

      {!fromMission && images.length > 1 && showGuide && (
        <BrochureGuideOverlay eventId={eventId} />
      )}
      {fromMission && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50 flex justify-center">
          <BrochureEventButton className="mt-4" />
        </div>
      )}
    </div>
  );
};

export default BrochureClient;
