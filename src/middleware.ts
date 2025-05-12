import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
    const { pathname } = req.nextUrl;

    const isProtectedRoute = pathname === "/" ||
        pathname.startsWith("/history")

    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("from", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/", "/history"]
}