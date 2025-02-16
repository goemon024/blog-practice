
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "../lib/util/supabase"



export const authConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log("認証開始:", credentials?.password)
                if (!credentials?.username || !credentials?.password) {
                    console.log("ユーザー名またはパスワードが不足しています")
                    throw new Error("ユーザー名またはパスワードが不足しています")
                }

                // ユーザーを検索
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id,email,username')
                    .eq('username', credentials.username)
                    .single()

                // .eq('username', credentials.username)
                // .single()

                console.log(userData)

                if (userError || !userData) {
                    console.log("ユーザーが見つかりません")
                    throw new Error("ユーザーが見つかりません")
                }

                const { data: { user }, error } = await supabase.auth.signInWithPassword({
                    email: userData.email,
                    password: credentials.password
                })

                return {
                    id: userData.id,
                    username: userData.username,
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.username = token.username as string
            }
            return session
        }
    },
    pages: {
        signIn: '/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig


