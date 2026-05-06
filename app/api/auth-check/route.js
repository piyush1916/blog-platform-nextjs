import { NextResponse } from "next/server";
import { validateAuthorizationHeader } from "../../../lib/mock-data";

export async function GET(request) {
  const user = validateAuthorizationHeader(request.headers.get("authorization"));

  return NextResponse.json({
    authenticated: Boolean(user),
  });
}
