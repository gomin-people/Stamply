import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/utils/supabase/session-server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  // 카카오가 리디렉트 시 전달하는 일회용 인가 코드
  // ex) /api/v1/oauth/kakao?code=XXXXXX
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/admin?error=missing_code`);
  }

  // 카카오 서버에 인가 코드를 보내 실제 토큰으로 교환
  // redirect_uri는 카카오 콘솔에 등록된 값과 정확히 일치해야 함
  const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_CLIENT_ID!,
      client_secret: process.env.KAKAO_CLIENT_SECRET!,
      redirect_uri: process.env.KAKAO_REDIRECT_URI!,
      code,
    }),
  });

  const kakaoTokenData = await tokenRes.json();

  // id_token: 유저 정보(닉네임, 프로필 등)가 JWT로 인코딩된 토큰
  // 로그인 시 openid 스코프를 요청했기 때문에 발급됨
  const { id_token } = kakaoTokenData;

  if (!id_token) {
    return NextResponse.redirect(`${origin}/admin?error=token_failed`);
  }

  const supabase = await createSessionClient();

  // id_token을 Supabase에 전달해 세션 생성
  // 1. Supabase가 카카오 공개키로 id_token 서명 검증
  // 2. 신규 유저면 auth.users 테이블에 자동 생성
  // 3. Access Token + Refresh Token 발급 후 쿠키에 저장 (createSessionClient의 setAll 호출)
  const { error } = await supabase.auth.signInWithIdToken({
    provider: "kakao",
    token: id_token,
  });

  if (error) {
    return NextResponse.redirect(`${origin}/admin?error=auth_failed`);
  }

  // 세션 쿠키가 저장된 상태로 대시보드로 이동
  // 이후 미들웨어가 쿠키를 읽어 인증 여부를 확인함
  return NextResponse.redirect(`${origin}/admin/dashboard`);
}
