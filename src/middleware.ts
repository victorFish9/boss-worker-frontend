import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
    console.log(token)

    const isProtectedRoute = req.nextUrl.pathname.startsWith("/")

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/", "/history"]
}