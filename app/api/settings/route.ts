import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function GET() {
  try {
    const store = getStore();
    return NextResponse.json({
      settings: store.settings,
      seo: {
        metaTitle: store.seo.metaTitle,
        metaDescription: store.seo.metaDescription,
        keywords: store.seo.keywords
      }
    });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
