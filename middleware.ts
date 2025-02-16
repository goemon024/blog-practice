// import NextAuth from "next-auth"
// import { authConfig } from "./app/auth"

// export const { auth: middleware } = NextAuth(authConfig)
// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // 🔹 認証が不要なページ
    const publicPaths = ["/", "/auth/signin", "/auth/signup"];

    if (publicPaths.includes(req.nextUrl.pathname)) {
        return NextResponse.next(); // そのままアクセスを許可
    }

    // 🔹 認証が必要なページにアクセスした場合
    if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next(); // 認証済みならアクセス許可
}

// 🔹 Middleware を適用するパスを設定
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"], // 例: "/dashboard" や "/profile" 以下は認証が必要
};
