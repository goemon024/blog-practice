import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "../lib/util/supabase";

import { User } from "next-auth";
import { Session } from "next-auth";

import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // eslint-disable-next-line no-console
        console.log("認証開始:", credentials?.password);
        if (!credentials?.username || !credentials?.password) {
          // eslint-disable-next-line no-console
          console.log("ユーザー名またはパスワードが不足しています");
          throw new Error("ユーザー名またはパスワードが不足しています");
        }

        // ユーザーを検索
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id,email,username,image_path")
          .eq("username", credentials.username)
          .single();

        // .eq('username', credentials.username)
        // .single()

        // eslint-disable-next-line no-console
        console.log(userData);

        if (userError || !userData) {
          // eslint-disable-next-line no-console
          console.log("ユーザーが見つかりません");
          throw new Error("ユーザーが見つかりません");
        }

        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          data: { user },
          // error: _,
        } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: credentials.password as string,
        });

        return {
          id: userData.id,
          username: userData.username,
          image: userData.image_path,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: User & {
        id: string;
        username: string;
        image?: string | null;
      };
    }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.image = user.image;
      } else {
        // userがない場合（セッション更新時）は、Supabaseから最新情報を取得
        const { data: userData, error } = await supabase
          .from("users")
          .select("username, image_path")
          .eq("id", token.id)
          .single();

        if (userData && !error) {
          token.username = userData.username;
          token.image = userData.image_path;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
