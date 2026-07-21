import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/auth";

const PAGES_TO_AUDIT = [
  { name: "Home / Dashboard", path: "/" },
  { name: "Informative Blog", path: "/blog" },
  { name: "YouTube Channel ID Finder", path: "/youtube/channel" },
  { name: "YouTube Thumbnail Downloader", path: "/youtube/thumbnail" },
  { name: "YouTube Video Downloader", path: "/youtube/video-downloader" },
  { name: "YouTube Embed / Video ID Finder", path: "/youtube/embed" },
  { name: "AI OCR Reader", path: "/ai/ocr" },
  { name: "AI Background Remover", path: "/ai/bg-remover" },
  { name: "Color Converter", path: "/web/color-converter" },
  { name: "Color Palette Generator", path: "/web/color-tools" },
  { name: "Developer Utilities", path: "/web/dev-utils" },
  { name: "Random Generators", path: "/web/generators" },
  { name: "Text Case Converter", path: "/web/text-utils" },
  { name: "Password Generator", path: "/web/password" },
  { name: "Word Counter", path: "/web/word-counter" },
  { name: "ID Photo Maker", path: "/image/id-photo" },
  { name: "Meme Generator", path: "/image/meme" },
  { name: "Collage Maker", path: "/image/collage" },
  { name: "Image Splitter", path: "/image/splitter" },
  { name: "Image Compressor", path: "/image/compressor" },
  { name: "Text on Image", path: "/image/text-on-image" },
  { name: "Passport Photo", path: "/image/passport" },
  { name: "Rounded Corners", path: "/image/rounded-corners" },
  { name: "Image Watermark", path: "/image/watermark" },
  { name: "AI Image Upscaler", path: "/image/upscaler" },
  { name: "Image Converter", path: "/image/converter" },
  { name: "Blur Image", path: "/image/blur" },
  { name: "Circular Crop", path: "/image/circular-crop" },
  { name: "Aspect Ratio", path: "/image/aspect-ratio" },
  { name: "Image Editor", path: "/image/editor" }
];

function getMetaContent(html: string, nameOrProperty: string): string | null {
  // Try pattern: name="XYZ" content="ABC"
  let regex = new RegExp(`<meta\\s+[^>]*?(?:name|property)="${nameOrProperty}"\\s+[^>]*?content="([^"]*?)"`, 'i');
  let match = html.match(regex);
  if (match) return decodeHtml(match[1]);

  // Try pattern: content="ABC" name="XYZ"
  regex = new RegExp(`<meta\\s+[^>]*?content="([^"]*?)"\\s+[^>]*?(?:name|property)="${nameOrProperty}"`, 'i');
  match = html.match(regex);
  if (match) return decodeHtml(match[1]);

  return null;
}

function decodeHtml(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = [];
    const port = process.env.PORT || 3000;
    const baseUrl = `http://127.0.0.1:${port}`;

    for (const page of PAGES_TO_AUDIT) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      try {
        const targetUrl = `${baseUrl}${page.path}`;
        const response = await fetch(targetUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SEO-Audit-Scanner/1.0",
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          results.push({
            name: page.name,
            path: page.path,
            status: response.status,
            error: `Page returned HTTP status ${response.status}`,
            passed: false,
            metrics: {
              hasTitle: false,
              hasDescription: false,
              hasKeywords: false,
              hasOgTitle: false,
              hasOgDescription: false,
              hasOgType: false,
              hasTwitterCard: false,
            },
            values: {}
          });
          continue;
        }

        const html = await response.text();

        // Extract Title
        const titleMatch = html.match(/<title>([^<]*?)<\/title>/i);
        const title = titleMatch ? decodeHtml(titleMatch[1]) : null;

        // Extract Metas
        const description = getMetaContent(html, "description");
        const keywords = getMetaContent(html, "keywords");
        const ogTitle = getMetaContent(html, "og:title");
        const ogDescription = getMetaContent(html, "og:description");
        const ogType = getMetaContent(html, "og:type");
        const twitterCard = getMetaContent(html, "twitter:card");
        const twitterTitle = getMetaContent(html, "twitter:title");
        const twitterDescription = getMetaContent(html, "twitter:description");

        const hasTitle = !!title && title.length > 5;
        const hasDescription = !!description && description.length > 10;
        const hasKeywords = !!keywords && keywords.length > 3;
        const hasOgTitle = !!ogTitle || !!title;
        const hasOgDescription = !!ogDescription || !!description;
        const hasOgType = !!ogType;
        const hasTwitterCard = !!twitterCard;

        // An audit passes if it has title and description (critical for SEO)
        const passed = hasTitle && hasDescription;

        results.push({
          name: page.name,
          path: page.path,
          status: 200,
          passed,
          metrics: {
            hasTitle,
            hasDescription,
            hasKeywords,
            hasOgTitle,
            hasOgDescription,
            hasOgType,
            hasTwitterCard,
          },
          values: {
            title: title || "Missing",
            description: description || "Missing",
            keywords: keywords || "Missing",
            ogTitle: ogTitle || ogTitle || "Missing",
            ogDescription: ogDescription || "Missing",
            ogType: ogType || "Missing",
            twitterCard: twitterCard || "Missing",
            twitterTitle: twitterTitle || "Missing",
            twitterDescription: twitterDescription || "Missing"
          }
        });

      } catch (err: any) {
        clearTimeout(timeoutId);
        results.push({
          name: page.name,
          path: page.path,
          status: 0,
          error: err.message || "Request Timed Out",
          passed: false,
          metrics: {
            hasTitle: false,
            hasDescription: false,
            hasKeywords: false,
            hasOgTitle: false,
            hasOgDescription: false,
            hasOgType: false,
            hasTwitterCard: false,
          },
          values: {}
        });
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length,
        errorPages: results.filter(r => r.status !== 200).length,
      },
      results
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to run SEO audit" }, { status: 500 });
  }
}
