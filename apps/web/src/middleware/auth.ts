import { NextResponse } from "next/server";
import { useAuth } from "../../utils/auth-helper";

export async function authMiddleware() {
  const { user } = await useAuth(); // uses the useAuth utility from auth-helper.ts
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
