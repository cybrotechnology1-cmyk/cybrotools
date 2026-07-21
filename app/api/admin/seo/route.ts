import { NextRequest, NextResponse } from "next/server";
import { getStore, saveStore, addAuditLog, SeoSettings } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  return NextResponse.json(store.seo);
}

export async function POST(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedSeo: SeoSettings = await req.json();
    const store = getStore();

    store.seo = {
      ...store.seo,
      ...updatedSeo,
    };
    saveStore(store);

    addAuditLog("SEO Updated", "Updated global SEO preferences, Robots.txt, and Sitemap.xml.");
    return NextResponse.json(store.seo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update SEO settings" }, { status: 500 });
  }
}
