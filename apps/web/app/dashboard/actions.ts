"use server";

import { bookshelf as bookshelfdb, db, eq } from "@repo/database";
import { useAuth } from "../../utils/auth-helper";

export async function addBookshelf(initialState: any, formData: FormData) {
  const { title, description } = Object.fromEntries(formData) as {
    title: string;
    description: string;
  };
  const { user } = await useAuth();
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }
  const bookshelf = await db
    .insert(bookshelfdb)
    .values({
      title,
      description,
      userId: user.id,
    })
    .returning();
  return { success: true, message: "Bookshelf created", data: bookshelf[0] };
}
