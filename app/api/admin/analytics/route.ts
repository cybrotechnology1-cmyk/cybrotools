import { NextRequest, NextResponse } from "next/server";
import { getStore, addAuditLog } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = getStore();

    // Calculate dynamic analytics data
    const totalPosts = store.posts.length;
    const totalCategories = store.categories.length;
    const totalMedia = store.media.length;
    
    const totalTools = store.tools.length;
    const activeTools = store.tools.filter((t) => t.enabled).length;
    const inactiveTools = totalTools - activeTools;

    const stats = {
      totalPosts,
      totalCategories,
      totalMedia,
      totalTools,
      activeTools,
      inactiveTools,
    };

    return NextResponse.json({
      stats,
      logs: store.logs,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
