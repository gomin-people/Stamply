import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/utils/supabase/session-server";

const SUPABASE_ERROR_MESSAGES: Record<string, string> = {
  "User already registered": "이미 가입된 이메일입니다.",
};

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    const message = SUPABASE_ERROR_MESSAGES[error.message] ?? error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ user: data.user }, { status: 201 });
};
