import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function redirectTo(req: NextRequest, path: string) {
  const url = req.nextUrl.clone();
  url.pathname = path;
  url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ========= SUPER ADMIN =============
  if (pathname.startsWith("/super-admin")) {
    if (pathname.startsWith("/super-admin/login")) return NextResponse.next();
    const saAt = req.cookies.get("sa_at")?.value;
    if (!saAt) return redirectTo(req, "/super-admin/login");
    return NextResponse.next();
  }

  // ========= SCHOOL ADMIN ==========
  if (pathname.startsWith("/school-admin")) {
    const skAt = req.cookies.get("sk_at")?.value;
    if (!skAt) return redirectTo(req, "/school/login");
    return NextResponse.next();
  }

  // =========== SCHOOL USER AREA ===========
  if (pathname.startsWith("/school")) {
    if (pathname.startsWith("/school/login")) return NextResponse.next();
    const skAt = req.cookies.get("sk_at")?.value;
    if (!skAt) return redirectTo(req, "/school/login");
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*", "/school/:path*", "/school-admin/:path*"],
};
