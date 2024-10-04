"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../utils/auth-options";
import { bookshelf as bookshelfdb, db, eq, users } from "@repo/database";
// import { useAuth } from "../../utils/auth-helper";

export async function addBookshelf(initialState: any, formData: FormData) {
  const { title, description } = Object.fromEntries(formData) as {
    title: string;
    description: string;
  };
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, message: "Unauthorized" };
  if (!session.user) return { success: false, message: "Unauthorized" };
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email!));
  if (!user) return { success: false, message: "Unauthorized" };
  const bookshelf = await db
    .insert(bookshelfdb)
    .values({
      title,
      description,
      userId: user[0]!.id,
    })
    .returning();
  return { success: true, message: "Bookshelf created", bookshelf };
}

export async function deleteBookshelf(initialState: any, formData: FormData) {
  const { id } = Object.fromEntries(formData) as { id: string };

  const session = await getServerSession(authOptions);
  if (!session) return { success: false, message: "Unauthorized" };
  if (!session.user) return { success: false, message: "Unauthorized" };
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email!));
  if (user.length < 1) return { success: false, message: "Unauthorized" };

  const currentBookshelf = await db
    .select()
    .from(bookshelfdb)
    .where(eq(bookshelfdb.id, parseInt(id)));

  if (!currentBookshelf)
    return { success: false, message: "Couldn't find bookshelf" };
  if (currentBookshelf[0]?.userId !== user[0]!.id) {
    return { success: false, message: "Unauthorized" };
  }

  const bookshelf = await db
    .delete(bookshelfdb)
    .where(eq(bookshelfdb.id, parseInt(id)))
    .returning();
  return { success: true, message: "Bookshelf deleted", bookshelf };
}
// if (!user) {
//   return { success: false, message: "Unauthorized" };
// }
// const bookshelf = await db
//   .insert(bookshelfdb)
//   .values({
//     title,
//     description,
//     userId: user.id,
//   })
//   .returning();
