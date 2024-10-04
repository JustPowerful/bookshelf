import { NextRequest, NextResponse } from "next/server";
import { useAuth } from "../../../../utils/auth-helper";
import { bookshelf, db, eq } from "@repo/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user } = await useAuth();
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const bs = (
    await db
      .select()
      .from(bookshelf)
      .where(eq(bookshelf.id, parseInt(params.id)))
  )[0];

  if (!bs)
    return NextResponse.json(
      {
        message: "Bookshelf not found",
      },
      { status: 404 }
    );

  if (bs.userId !== user.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    message: "Successfully fetched bookshelf",
    bookshelf: bs,
  });
  // get bookshelf by id parameter
}
