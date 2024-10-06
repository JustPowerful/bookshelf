"use server";

import { books, bookshelf, db, documents, eq } from "@repo/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../utils/auth-options";

export async function deleteBook(initialState: any, formData: FormData) {
  const { id } = Object.fromEntries(formData) as {
    id: string;
  };
  if (!id)
    return { success: false, message: "Couldn't find the id of the book" };

  // check auth
  const session = await getServerSession(authOptions);
  if (!session || !session.user)
    return { success: false, message: "Unauthorized" };

  const book = (
    await db
      .select()
      .from(books)
      .where(eq(books.id, parseInt(id)))
  )[0];
  if (!book) return { success: false, message: "Couldn't find the book" };

  const bs = (
    await db.select().from(bookshelf).where(eq(bookshelf.id, book.bookshelfId))
  )[0];

  if (!bs || bs.userId !== parseInt(session.user.id!))
    return { success: false, message: "Unauthorized" };

  // delete books from the database
  await db
    .delete(books)
    .where(eq(books.id, parseInt(id)))
    .returning();

  // after deleting the book from the database, we need to delete the embeddings
  await db.delete(documents).where(eq(documents.bookId, parseInt(id)));

  return { success: true, message: "Book deleted", book };
}
