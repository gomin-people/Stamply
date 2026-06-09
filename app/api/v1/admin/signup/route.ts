import { NextRequest, NextResponse } from "next/server";
import { signupApiSchema } from "@/types/schemas/adminSignupSchemas";
import { createSessionClient } from "@/utils/supabase/session-server";

const SUPABASE_ERROR_MESSAGES: Record<string, string> = {
  "User already registered": "이미 가입된 이메일입니다.",
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const parsed = signupApiSchema.safeParse(body);

  if (!parsed.success) {
    const message = parsed.error.issues[0].message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    const message = SUPABASE_ERROR_MESSAGES[error.message] ?? error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ user: data.user }, { status: 201 });
};
