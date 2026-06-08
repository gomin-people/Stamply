import { createSessionClient } from "@/utils/supabase/session-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  return NextResponse.json({ name: user.user_metadata.full_name, id: user.id });
}
