import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EVENT_REGISTER_PATH } from "@/constants/adminRoutes";
import { createSessionClient } from "@/utils/supabase/session-server";

const redirectToAdminError = (request: NextRequest, error: string) => {
  const redirectUrl = new URL("/admin", request.nextUrl.origin);
  redirectUrl.searchParams.set("error", error);

  return NextResponse.redirect(redirectUrl, { status: 303 });
};

export const POST = async (request: NextRequest) => {
  if (process.env.STAMPLY_TEST_LOGIN_ENABLED !== "true") {
    return redirectToAdminError(request, "test_login_disabled");
  }

  const email = process.env.STAMPLY_TEST_LOGIN_EMAIL;
  const password = process.env.STAMPLY_TEST_LOGIN_PASSWORD;

  if (!email || !password) {
    return redirectToAdminError(request, "test_login_not_configured");
  }

  const supabase = await createSessionClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Test login failed:", error);
    return redirectToAdminError(request, "test_login_failed");
  }

  const { data: eventId, error: eventsError } = await supabase.rpc(
    "get_priority_admin_event_id"
  );

  let redirectPath = ADMIN_EVENT_REGISTER_PATH;

  if (eventsError) {
    console.error("Error fetching events after test login:", eventsError);
    redirectPath = "/admin";
  } else if (eventId != null) {
    redirectPath = `/admin/events/${eventId}/dashboard`;
  }

  return NextResponse.redirect(`${request.nextUrl.origin}${redirectPath}`, {
    status: 303,
  });
};
