import { notFound } from "next/navigation";
import { getEventPrimaryColor } from "@/features/participant/events/participantEventTheme";
import { ThemeInitializer } from "@/components/user/common/ThemeInitializer";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}

export default async function EventLayout({ children, params }: LayoutProps) {
  const { eventId: eventIdParam } = await params;

  // features에 이미 구현된 함수를 활용해 행사 존재 여부 검증 및 primaryColor 획득
  const primaryColor = await getEventPrimaryColor(eventIdParam);

  if (!primaryColor) {
    return notFound();
  }

  return (
    <>
      <ThemeInitializer primaryColor={primaryColor} />
      {children}
    </>
  );
}
