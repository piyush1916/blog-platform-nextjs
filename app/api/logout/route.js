import { NextResponse } from "next/server";
import { TOKEN_STORAGE_KEY } from "../../../lib/constants";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(TOKEN_STORAGE_KEY, "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}
