import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/supabase/session";
import { Role } from "./types";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  const authPages = ["/manufacturer/sign-in", "/manufacturer/sign-up"];
  const isAuthPage = authPages.includes(path);

  const isDashboard = path.startsWith("/manufacturer/dashboard");
  const isOnboarding = path.startsWith("/manufacturer/onboarding");

  const session = await getSession(Role.MANUFACTURER);

  // 🔒 1. Not logged in → block dashboard & onboarding, send to sign-in
  if (!session && (isDashboard || isOnboarding)) {
    url.pathname = "/manufacturer/sign-in";
    return NextResponse.redirect(url);
  }

  // If no session and going to auth pages → allow
  if (!session) {
    return NextResponse.next();
  }

  // ✅ 2. Logged in & tries to visit /sign-in or /sign-up
  //    → send them to dashboard or onboarding depending on isOnboarded
  if (isAuthPage) {
    url.pathname = session.isOnboarded
      ? "/manufacturer/dashboard"
      : "/manufacturer/onboard";
    return NextResponse.redirect(url);
  }

  // ✅ 3. Logged in but NOT onboarded:
  //    - visiting dashboard → force to onboarding
  if (!session.isOnboarded && isDashboard) {
    url.pathname = "/manufacturer/onboard";
    return NextResponse.redirect(url);
  }

  // ✅ 4. Logged in AND onboarded:
  //    - visiting onboarding page → send to dashboard
  if (session.isOnboarded && isOnboarding) {
    url.pathname = "/manufacturer/dashboard";
    return NextResponse.redirect(url);
  }

  if (!session || session.role !== "MANUFACTURER") {
    return NextResponse.redirect(new URL("/manufacturer/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
