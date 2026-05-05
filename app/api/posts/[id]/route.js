import { NextResponse } from "next/server";
import {
  getPostById,
  validateAuthorizationHeader,
} from "../../../../lib/mock-data";

export async function GET(request, { params }) {
  const user = validateAuthorizationHeader(request.headers.get("authorization"));

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    return NextResponse.json({ message: "Post not found." }, { status: 404 });
  }

  return NextResponse.json(post);
}
