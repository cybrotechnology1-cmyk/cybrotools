import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function GET() {
  try {
    const store = getStore();
    return NextResponse.json(store.tools);
  } catch (error) {
    console.error("Failed to fetch tools:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
