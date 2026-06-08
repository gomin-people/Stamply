"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { participantEventQueryOptions } from "@/features/participant/events/participantEventOptions";
import EventPoster from "@/components/user/common/EventPoster";
import ThemedButton from "@/components/user/common/ThemedButton";

type Props = {
  eventId: string;
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" as const, delay },
});

export default function EntryPageClient({ eventId }: Props) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const { data: event } = useQuery(
    participantEventQueryOptions(Number(eventId))
  );

  const handleStart = () => {
    if (exiting) return;
    setExiting(true);
  };

  return (
    <main className="h-full overflow-hidden bg-white flex justify-center">
      {/* prefetch 전용 — 렌더링 없이 브로셔 페이지를 미리 로드 */}
      <Link
        href={`/event/${eventId}/brochure`}
        className="hidden"
        aria-hidden
        tabIndex={-1}
      />
      <AnimatePresence
        onExitComplete={() => router.push(`/event/${eventId}/brochure`)}
      >
        {!exiting && (
          <motion.div
            key="entry-content"
            className="w-full max-w-100.5 h-full flex flex-col items-center justify-center px-12 pb-10 pt-14 min-h-0"
            exit={{
              opacity: 0,
              y: -40,
              transition: { duration: 0.35, ease: "easeIn" },
            }}
          >
            <motion.div
              className="min-h-0 w-full flex justify-center"
              {...fadeUp(0)}
            >
              <EventPoster
                src={event?.posterImageUrl ?? ""}
                width={300}
                height={440}
                maxHeight="min(440px, calc(100vh - 136px))"
              />
            </motion.div>

            <motion.div className="mt-5.5 w-full max-w-76" {...fadeUp(0.15)}>
              <motion.div className="w-full" whileTap={{ scale: 0.97 }}>
                <ThemedButton className="w-full" onClick={handleStart}>
                  시작하기
                </ThemedButton>
              </motion.div>
            </motion.div>

            <motion.p
              className="font-sans text-sm font-bold leading-normal text-gomin-neutral-500 whitespace-nowrap pt-2.5"
              {...fadeUp(0.25)}
            >
              powered by stamply
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
