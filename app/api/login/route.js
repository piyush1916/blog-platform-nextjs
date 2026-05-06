import { NextResponse } from "next/server";
import { loginMockUser } from "../../../lib/mock-data";
import { TOKEN_STORAGE_KEY } from "../../../lib/constants";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const email = body?.email?.trim();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const result = loginMockUser({ email, password });

  if (result.error) {
    return NextResponse.json({ message: result.error }, { status: 401 });
  }

  const response = NextResponse.json({ token: result.token });
  response.cookies.set(TOKEN_STORAGE_KEY, result.token, {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "strict",
  });

  return response;
}
