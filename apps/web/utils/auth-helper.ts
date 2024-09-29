import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import { db, eq, users } from "@repo/database";

export async function useAuth(): Promise<{
  user: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
  } | null;
}> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { user: null };
  }
  const user = (
    await db.select().from(users).where(eq(users.email, session.user.email!))
  )[0];
  if (!user) {
    return { user: null };
  }
  return {
    user: {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    },
  };
}
