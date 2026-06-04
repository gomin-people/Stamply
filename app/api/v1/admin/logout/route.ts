import { createSessionClient } from "@/utils/supabase/session-server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { error: "로그아웃에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "로그아웃 되었습니다." });
}
