import { NextRequest, NextResponse } from "next/server";
import { getStore, saveStore, addAuditLog, MediaItem } from "@/lib/db";
import { validateAdminRequest } from "@/lib/auth";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function initUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = getStore();
  return NextResponse.json(store.media);
}

export async function POST(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, type, size, data } = await req.json(); // data is base64 string
    if (!name || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate file type to prevent uploading dangerous files
    const ALLOWED_TYPES = [
      "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
      "application/pdf",
      "video/mp4", "video/webm",
      "audio/mpeg", "audio/mp4",
    ];
    if (type && !ALLOWED_TYPES.includes(type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (size && parseInt(size, 10) > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    // Validate base64 data doesn't exceed reasonable size
    const base64Data = data.replace(/^data:image\/\w+;base64,/, "").replace(/^data:application\/\w+;base64,/, "").replace(/^data:video\/\w+;base64,/, "").replace(/^data:audio\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json({ error: "Decoded file exceeds 10MB limit" }, { status: 400 });
    }

    initUploadsDir();

    // Clean up filename to prevent directory traversal
    const safeName = path.basename(name).replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${safeName}`;
    const filePath = path.join(UPLOADS_DIR, uniqueName);

    // Write file to public/uploads
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${uniqueName}`;

    const store = getStore();
    const newMedia: MediaItem = {
      id: "media-" + Math.random().toString(36).substring(2, 9),
      name: safeName,
      url: relativeUrl,
      size,
      type,
      uploadedAt: new Date().toISOString(),
    };

    store.media = [newMedia, ...store.media];
    saveStore(store);

    addAuditLog("Media Uploaded", `Uploaded file: "${safeName}" to ${relativeUrl}`);
    return NextResponse.json(newMedia);
  } catch (error) {
    console.error("Failed to upload media:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
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
    const itemIndex = store.media.findIndex((m) => m.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    const item = store.media[itemIndex];
    const fileName = path.basename(item.url);
    const filePath = path.join(UPLOADS_DIR, fileName);

    // Try to delete physical file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("Physical file deletion failed:", err);
    }

    store.media.splice(itemIndex, 1);
    saveStore(store);

    addAuditLog("Media Deleted", `Deleted media asset: "${item.name}"`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
