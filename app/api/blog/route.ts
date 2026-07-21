import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const store = getStore();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const post = store.posts.find((p) => p.id === id);
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    return NextResponse.json(store.posts);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
