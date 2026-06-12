"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isComplete = pathname.endsWith("/complete");

  return (
    <main className={`flex-1${isComplete ? "" : " overflow-y-auto"}`}>
      {children}
    </main>
  );
}
