import { NextRequest, NextResponse } from "next/server";
import { getStore, saveStore, addAuditLog, WebSettings } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  return NextResponse.json(store.settings);
}

export async function POST(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedSettings: WebSettings = await req.json();
    const store = getStore();

    store.settings = {
      ...store.settings,
      ...updatedSettings,
    };
    saveStore(store);

    addAuditLog("Settings Updated", `Updated general website config (Name: "${updatedSettings.siteName}").`);
    return NextResponse.json(store.settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update general settings" }, { status: 500 });
  }
}
