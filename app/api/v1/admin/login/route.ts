import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/types/schemas/adminLoginSchemas";
import { createSessionClient } from "@/utils/supabase/session-server";

const SUPABASE_ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "Email not confirmed":
    "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.",
  "Too many requests": "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    const message = parsed.error.issues[0].message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const message = SUPABASE_ERROR_MESSAGES[error.message] ?? error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
};
