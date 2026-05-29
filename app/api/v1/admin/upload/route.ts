import { supabase } from "@/utils/supabase/server";
import { badRequest, serverError } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

const BUCKET = "Stamply";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return badRequest("파일이 없습니다.");

  const ext = file.name.split(".").pop();
  const path = `events/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) return serverError("이미지 업로드 실패", error);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl, path });
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as { path?: string };

  if (!body.path) return badRequest("path가 없습니다.");

  const { error } = await supabase.storage.from(BUCKET).remove([body.path]);

  if (error) return serverError("이미지 삭제 실패", error);

  return NextResponse.json({ path: body.path });
}
