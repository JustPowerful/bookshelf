import { db, users, eq } from "@repo/database";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { firstname, lastname, email, password } = await request.json();
  const user = await db.select().from(users).where(eq(users.email, email));
  if (user) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db
    .insert(users)
    .values({ firstname, lastname, email: email, password: hashedPassword });
  return NextResponse.json({ message: "User created" });
}
