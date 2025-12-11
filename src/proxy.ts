import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/supabase/session";
import { Role } from "./types";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isManufacturerRoute = pathname.startsWith("/manufacturer");

  if (!isManufacturerRoute) {
    return NextResponse.next();
  }

  const session = await getSession(Role.MANUFACTURER);

  if (!session) {
    if (
      pathname !== "/manufacturer/sign-in" &&
      pathname !== "/manufacturer/sign-up"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/manufacturer/sign-in";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const isAuthPage =
    pathname === "/manufacturer/sign-in" ||
    pathname === "/manufacturer/sign-up";

  if (isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/manufacturer/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
