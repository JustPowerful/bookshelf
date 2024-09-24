import { getServerSession } from "next-auth";
import { authOptions } from "@/../utils/auth-options";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  return NextResponse.json(session);
}
