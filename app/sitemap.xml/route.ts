import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function GET() {
  try {
    const store = getStore();
    return new NextResponse(store.seo.sitemapXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to generate sitemap.xml:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
