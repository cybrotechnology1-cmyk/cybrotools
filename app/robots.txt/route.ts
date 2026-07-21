import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function GET() {
  try {
    const store = getStore();
    return new NextResponse(store.seo.robotsTxt, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to generate robots.txt:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
