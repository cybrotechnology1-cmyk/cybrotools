import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL or handle is required" }, { status: 400 });
    }

    const cleanUrl = url.trim();

    // Limit input length
    if (cleanUrl.length > 500) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    // 1. Direct Channel ID Match (UC...)
    const directMatch = cleanUrl.match(/(UC[a-zA-Z0-9_-]{22})/);
    if (directMatch) {
      return NextResponse.json({ channelId: directMatch[1] });
    }

    // 2. Resolve username / handles / custom URLs by fetching the page
    let fetchUrl = cleanUrl;
    if (!cleanUrl.startsWith("http")) {
      if (cleanUrl.startsWith("@")) {
        fetchUrl = `https://www.youtube.com/${cleanUrl}`;
      } else {
        fetchUrl = `https://www.youtube.com/@${cleanUrl}`;
      }
    }

    const response = await fetch(fetchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Could not fetch YouTube page. Please check the URL or handle." }, { status: 400 });
    }

    const html = await response.text();

    // Pattern A: itemprop="channelId"
    const metaPattern = /<meta\s+itemprop="channelId"\s+content="(UC[a-zA-Z0-9_-]{22})"/i;
    const metaMatch = html.match(metaPattern);
    if (metaMatch) {
      return NextResponse.json({ channelId: metaMatch[1] });
    }

    // Pattern B: RSS feeds
    const rssPattern = /channel_id=(UC[a-zA-Z0-9_-]{22})/;
    const rssMatch = html.match(rssPattern);
    if (rssMatch) {
      return NextResponse.json({ channelId: rssMatch[1] });
    }

    // Pattern C: JSON contexts
    const jsonPattern = /"channelId"\s*:\s*"(UC[a-zA-Z0-9_-]{22})"/;
    const jsonMatch = html.match(jsonPattern);
    if (jsonMatch) {
      return NextResponse.json({ channelId: jsonMatch[1] });
    }

    const browsePattern = /"browseId"\s*:\s*"(UC[a-zA-Z0-9_-]{22})"/;
    const browseMatch = html.match(browsePattern);
    if (browseMatch) {
      return NextResponse.json({ channelId: browseMatch[1] });
    }

    // Pattern D: Generic regex lookup
    const generalPattern = /(UC[a-zA-Z0-9_-]{22})/;
    const generalMatch = html.match(generalPattern);
    if (generalMatch) {
      return NextResponse.json({ channelId: generalMatch[1] });
    }

    return NextResponse.json({ error: "Channel ID not found. Ensure it is a valid YouTube URL or handle." }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An unexpected error occurred" }, { status: 500 });
  }
}
