import { NextRequest, NextResponse } from "next/server";
import { getStore, saveStore, addAuditLog, BlogPost } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  return NextResponse.json(store.posts);
}

export async function POST(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const postData: Omit<BlogPost, "id" | "date"> = await req.json();
    const store = getStore();

    const newPost: BlogPost = {
      ...postData,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    store.posts = [newPost, ...store.posts];
    saveStore(store);

    addAuditLog("Blog Created", `Created blog post: "${newPost.title}"`);
    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedPost: BlogPost = await req.json();
    const store = getStore();

    const index = store.posts.findIndex((p) => p.id === updatedPost.id);
    if (index === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    store.posts[index] = {
      ...store.posts[index],
      ...updatedPost,
    };
    saveStore(store);

    addAuditLog("Blog Updated", `Updated blog post: "${updatedPost.title}"`);
    return NextResponse.json(store.posts[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const store = getStore();
    const post = store.posts.find((p) => p.id === id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    store.posts = store.posts.filter((p) => p.id !== id);
    saveStore(store);

    addAuditLog("Blog Deleted", `Deleted blog post: "${post.title}"`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
