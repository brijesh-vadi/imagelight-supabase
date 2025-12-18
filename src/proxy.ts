import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/supabase/session";
import { Role } from "./types";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const routes = [
    {
      prefix: "/manufacturer",
      role: Role.MANUFACTURER,
      authPages: ["/manufacturer/sign-in", "/manufacturer/sign-up"],
      dashboard: "/manufacturer/dashboard",
    },
    {
      prefix: "/dealer",
      role: Role.DEALER,
      authPages: ["/dealer/sign-in", "/dealer/sign-up"],
      dashboard: "/dealer/dashboard",
    },
    {
      prefix: "/admin",
      role: Role.ADMIN,
      authPages: ["/admin/sign-in"],
      dashboard: "/admin/dashboard",
    },
  ];

  // Check each route type
  for (const route of routes) {
    if (pathname.startsWith(route.prefix)) {
      const session = await getSession(route.role);
      const isAuthPage = route.authPages.some((page) => pathname === page);

      if (session && isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = route.dashboard;
        return NextResponse.redirect(url);
      }

      if (!session && !isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = route.authPages[0];
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
