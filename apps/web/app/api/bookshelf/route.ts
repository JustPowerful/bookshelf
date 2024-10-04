import { NextResponse } from "next/server";
import { useAuth } from "../../../utils/auth-helper";
import { and, bookshelf, db, eq, like, users } from "@repo/database";

export async function GET(request: Request) {
  try {
    const { user } = await useAuth();
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const bookshelves = await db
      .select()
      .from(bookshelf)
      .where(
        and(
          eq(bookshelf.userId, user.id),
          like(bookshelf.title, `%${title ? title : ""}%`)
        )
      );
    return NextResponse.json({
      success: true,
      message: "Successfully fetched bookshelves",
      bookshelves,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const { user } = await useAuth();
//     if (!user) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//     const { title, description } = await request.json();
//     const bs = await db
//       .insert(bookshelf)
//       .values({ title, description, userId: user.id })
//       .returning();
//     return NextResponse.json({ success: true, bookshelf: bs[0] });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
