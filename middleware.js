import { NextResponse } from "next/server";

export function middleware(req) {
    const authToken = req.cookies.get("authToken");

    if (!authToken && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"], // Protect dashboard and subroutes
};