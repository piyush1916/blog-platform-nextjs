import { NextResponse } from "next/server";
import {
  getPaginatedPosts,
  validateAuthorizationHeader,
} from "../../../lib/mock-data";

export async function GET(request) {
  const user = validateAuthorizationHeader(request.headers.get("authorization"));

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  return NextResponse.json(getPaginatedPosts(page, limit));
}
