import { NextRequest, NextResponse } from 'next/server';
import { PARTICIPANT_COOKIE_NAME } from '@/utils/api';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.match(/^\/event\/[^/]+\/brochure/) && !pathname.startsWith('/admin')) {
    const participantCookie = request.cookies.get(PARTICIPANT_COOKIE_NAME);
    if (!participantCookie) {
      return NextResponse.redirect(new URL('/qr-required', request.url));
    }
  }

  return NextResponse.next();
}

// 우선 브로셔 페이지만 쿠키 없을때 미들웨어 처리를 했습니다. 엔트리랑 다른 페이지들은 2차 개발로 미루겠습니다.
// 아니면 우진님 미션 페이지 때 사용하셔도 됩니다. 
export const config = {
  matcher: ['/event/:eventId/brochure'],
};
