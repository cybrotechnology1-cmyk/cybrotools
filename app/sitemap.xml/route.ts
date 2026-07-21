import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

const BASE_URL = "https://cybrotools.xyz";
const TODAY = new Date().toISOString().split("T")[0];

const STATIC_URLS: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },

  // AI Image Tools
  { path: "/ai/bg-remover", priority: "0.9", changefreq: "weekly" },
  { path: "/ai/ocr", priority: "0.8", changefreq: "weekly" },
  { path: "/image/upscaler", priority: "0.9", changefreq: "weekly" },

  // Image Tools
  { path: "/image/editor", priority: "0.8", changefreq: "weekly" },
  { path: "/image/converter", priority: "0.7", changefreq: "monthly" },
  { path: "/image/compressor", priority: "0.7", changefreq: "monthly" },
  { path: "/image/blur", priority: "0.6", changefreq: "monthly" },
  { path: "/image/watermark", priority: "0.6", changefreq: "monthly" },
  { path: "/image/collage", priority: "0.6", changefreq: "monthly" },
  { path: "/image/splitter", priority: "0.6", changefreq: "monthly" },
  { path: "/image/aspect-ratio", priority: "0.6", changefreq: "monthly" },
  { path: "/image/circular-crop", priority: "0.6", changefreq: "monthly" },
  { path: "/image/rounded-corners", priority: "0.6", changefreq: "monthly" },
  { path: "/image/text-on-image", priority: "0.6", changefreq: "monthly" },
  { path: "/image/meme", priority: "0.6", changefreq: "monthly" },
  { path: "/image/id-photo", priority: "0.7", changefreq: "monthly" },
  { path: "/image/passport", priority: "0.7", changefreq: "monthly" },

  // YouTube Tools
  { path: "/youtube/thumbnail", priority: "0.7", changefreq: "weekly" },
  { path: "/youtube/embed", priority: "0.6", changefreq: "monthly" },
  { path: "/youtube/video-downloader", priority: "0.7", changefreq: "weekly" },
  { path: "/youtube/channel", priority: "0.6", changefreq: "monthly" },

  // Web Tools
  { path: "/web/generators", priority: "0.6", changefreq: "monthly" },
  { path: "/web/dev-utils", priority: "0.6", changefreq: "monthly" },
  { path: "/web/text-utils", priority: "0.6", changefreq: "monthly" },
  { path: "/web/color-tools", priority: "0.6", changefreq: "monthly" },
  { path: "/web/color-converter", priority: "0.6", changefreq: "monthly" },
  { path: "/web/password", priority: "0.7", changefreq: "monthly" },
  { path: "/web/word-counter", priority: "0.6", changefreq: "monthly" },
];

function buildUrlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  try {
    const store = getStore();
    const urls: string[] = [];

    for (const entry of STATIC_URLS) {
      urls.push(buildUrlEntry(`${BASE_URL}${entry.path}`, TODAY, entry.changefreq, entry.priority));
    }

    if (store.posts && store.posts.length > 0) {
      for (const post of store.posts) {
        const postDate = post.date
          ? new Date(post.date).toISOString().split("T")[0]
          : TODAY;
        urls.push(buildUrlEntry(`${BASE_URL}/blog/${post.id}`, postDate, "monthly", "0.6"));
      }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Failed to generate sitemap.xml:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
