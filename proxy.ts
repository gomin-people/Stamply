import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // TODO: 어드민 세션/토큰 검증 로직 추가
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
