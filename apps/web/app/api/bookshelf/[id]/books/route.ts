import { NextResponse } from "next/server";
import { useAuth } from "../../../../../utils/auth-helper";
import { and, books, bookshelf, db, eq, like } from "@repo/database";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { user } = await useAuth();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const bs = (
    await db
      .select()
      .from(bookshelf)
      .where(eq(bookshelf.id, parseInt(params.id)))
  )[0];
  if (!bs) return NextResponse.json({ message: "Bookshelf not found" });
  if (bs.userId !== user.id)
    return NextResponse.json({ message: "Unauthorized" });
  const bks = await db
    .select()
    .from(books)
    .where(
      and(
        eq(books.bookshelfId, parseInt(params.id)),
        like(books.title, `%${title ? title : ""}%`)
      )
    );
  return NextResponse.json({
    message: "Successfully fetched bookshelves",
    books: bks,
  });
}
