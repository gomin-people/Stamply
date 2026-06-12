"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
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
  const [exiting, setExiting] = useState(false);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1));
  const handleNext = () =>
    currentIndex < images.length - 1 && setCurrentIndex((prev) => prev + 1);

  const isLastPage = images.length > 0 && currentIndex === images.length - 1;

  const handleGoMission = () => !exiting && setExiting(true);

  return (
    <AnimatePresence
      onExitComplete={() => router.push(`/event/${eventId}/mission`)}
    >
      {!exiting && (
        <motion.div
          key="brochure-content"
          className={`bg-gomin-white flex flex-col items-center pt-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] ${!showGuide ? "animate-fade-in" : ""}`}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeIn" } }}
        >
          <div className="mb-4">
            <BrochureIndicator
              total={images.length}
              currentIndex={currentIndex}
            />
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
              onClick={handleGoMission}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrochureClient;
