import { NextRequest, NextResponse, userAgent } from "next/server";
import { PARTICIPANT_COOKIE_NAME } from "@/utils/api";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const { device } = userAgent(request);
    if (device.type === "mobile" || device.type === "tablet") {
      return NextResponse.redirect(new URL("/admin-unavailable", request.url));
    }
  }

  if (pathname.match(/^\/event\/[^/]+\/brochure/)) {
    const participantCookie = request.cookies.get(PARTICIPANT_COOKIE_NAME);
    if (!participantCookie) {
      return NextResponse.redirect(new URL("/qr-required", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/event/:eventId/brochure"],
};
