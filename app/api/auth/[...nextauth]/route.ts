import NextAuth from "next-auth";
import { authOptions } from "../../../auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(authConfig)
