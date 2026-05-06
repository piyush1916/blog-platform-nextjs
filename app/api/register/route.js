import { NextResponse } from "next/server";
import { registerMockUser } from "../../../lib/mock-data";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const name = body?.name?.trim();
  const email = body?.email?.trim();
  const password = body?.password;

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Name, email, and password are required." },
      { status: 400 },
    );
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json(
      { message: "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const result = registerMockUser({ name, email, password });

  if (result.error) {
    return NextResponse.json({ message: result.error }, { status: 409 });
  }

  return NextResponse.json({ message: result.message });
}
