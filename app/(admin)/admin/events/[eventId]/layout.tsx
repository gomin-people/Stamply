import { notFound, redirect } from "next/navigation";
import { createSessionClient } from "@/utils/supabase/session-server";

type AdminEventLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    eventId: string;
  }>;
};

const parseEventId = (value: string) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export default async function AdminEventLayout({
  children,
  params,
}: AdminEventLayoutProps) {
  const { eventId: eventIdParam } = await params;
  const eventId = parseEventId(eventIdParam);

  if (eventId === null) {
    notFound();
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();
    redirect("/admin");
  }

  // events 테이블 RLS로 현재 운영자가 접근 가능한 행사만 조회됩니다.
  const { data: event, error } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    console.error("Error checking admin event access:", error);
    throw new Error("관리자 행사 접근 권한 확인에 실패했습니다.");
  }

  if (!event) {
    notFound();
  }

  return children;
}
