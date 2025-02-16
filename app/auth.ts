import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { supabase } from "../lib/util/supabase"



export const authConfig = {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const { data: { user }, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email as string,
                    password: credentials.password as string,
                })

                if (error || !user) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata.name,
                }
            }
        })

    ], // 認証プロバイダーを設定
    pages: {
        signIn: '/signin',  // カスタムログインページ
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig

export const { auth, signIn, signOut } = NextAuth(authConfig)
