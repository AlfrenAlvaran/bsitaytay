import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ['/', '/about', '/contact', '/document', '/login', '/register']


export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  if (!req.cookies.get("access_token")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};