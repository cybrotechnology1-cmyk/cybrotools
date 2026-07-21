import { NextRequest, NextResponse } from "next/server";
import { getStore, saveStore, addAuditLog, ToolItem } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  return NextResponse.json(store.tools);
}

export async function POST(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedTools: ToolItem[] = await req.json();
    const store = getStore();

    store.tools = updatedTools;
    saveStore(store);

    addAuditLog("Tools Updated", "Modified available tools and categorization statuses on homepage.");
    return NextResponse.json(store.tools);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tools configuration" }, { status: 500 });
  }
}
