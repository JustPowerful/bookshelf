"use server";
import { users, eq, db } from "@repo/database";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function registerUser(
  currentState: any,
  formData: FormData
): Promise<string> {
  const formDataObj = Object.fromEntries(formData);
  const { firstname, lastname, email, password } = formDataObj as {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  };
  if (!firstname || !lastname || !email || !password) {
    return "Please fill in all fields";
  }
  const user = await db.select().from(users).where(eq(users.email, email));
  if (user.length > 0) {
    return "User already exists";
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db
    .insert(users)
    .values({ firstname, lastname, email, password: hashedPassword });

  redirect("/login");
}
