import NextAuth from "next-auth";
import { authConfig } from "../../../auth";

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };

// export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(authConfig)
