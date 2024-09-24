import NextAuth from "next-auth";
import { authOptions } from "@/utils/auth-options";
declare module "next-auth" {
  interface Session {
    user: {
      id: string | undefined | null;
      email: string | undefined | null;
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
