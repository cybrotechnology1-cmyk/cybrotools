import fs from "fs";
import path from "path";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  coverImage?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  robotsTxt: string;
  sitemapXml: string;
}

export interface ToolItem {
  id: string;
  name: string;
  href: string;
  category: string;
  enabled: boolean;
}

export interface WebSettings {
  siteName: string;
  siteDescription: string;
  footerText: string;
  analyticsId: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface StoreData {
  posts: BlogPost[];
  categories: Category[];
  media: MediaItem[];
  seo: SeoSettings;
  tools: ToolItem[];
  settings: WebSettings;
  logs: AuditLog[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "admin_store.json");

const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "How We Removed Image Backgrounds Instantly & Locally with cybro2.50 (Classic cybro AI)",
    excerpt: "Learn how we use advanced ONNX Runtime Web and WebGL inside Web Workers to perform AI background removal 100% in your browser safely.",
    category: "AI Image",
    date: "July 18, 2026",
    author: "Cybro Engineering Team",
    readTime: "4 min read",
    content: "Our AI background remover operates entirely on the client side. By leveraging WebAssembly and the cybro2.50 (Classic cybro AI) model loaded dynamically using transformers.js, we eliminate any server upload costs and ensure user files are never stored on external databases. This is a massive step forward for safe, private, and fast data processing."
  },
  {
    id: "2",
    title: "Deep Dive into Browser-based Image Cropping & Ratio Math",
    excerpt: "Discover the inner workings of canvas-based responsive cropping, aspect ratio math, and native clipping matrices without external libraries.",
    category: "Image Processing",
    date: "July 17, 2026",
    author: "Visual UI Group",
    readTime: "5 min read",
    content: "Many modern sites load large external canvas wrappers that frequently break on resized frames. We built a native React + percentage-based crop coordinator that transforms coordinates into canvas context draw operations using dynamic scaling parameters. This ensures pixel-perfect high-dpi results every single run."
  },
  {
    id: "3",
    title: "Why Client-Side Cryptographically Secure Generators Keep You Safe",
    excerpt: "Passwords and secrets should never touch a server. Why Web Crypto API is superior to mock randomized generators.",
    category: "Security",
    date: "July 15, 2026",
    author: "Security Team",
    readTime: "3 min read",
    content: "Our password generator utilizes window.crypto.getRandomValues for absolute entropy. Combined with offline client-side parsing, this prevents side-channel leaks, logging, and database exposure. Your security is 100% contained in your sandboxed browser tab."
  },
  {
    id: "4",
    title: "Optimizing YouTube Assets: The Mechanics of HD Thumbnails & Custom Embeds",
    excerpt: "An informational guide to extracting max-res thumbnails and configuring standard player parameters dynamically.",
    category: "Media Tools",
    date: "July 12, 2026",
    author: "Creator Lead",
    readTime: "3 min read",
    content: "YouTube provides several resolution fallbacks (maxresdefault, hqdefault, sddefault, mqdefault). We built an active handler checking and matching these resolutions to provide immediate asset downloads and dynamic player configurations for creators."
  }
];

const defaultCategories: Category[] = [
  { id: "cat-1", name: "AI Image", slug: "ai-image" },
  { id: "cat-2", name: "Image Processing", slug: "image-processing" },
  { id: "cat-3", name: "Security", slug: "security" },
  { id: "cat-4", name: "Media Tools", slug: "media-tools" }
];

const defaultTools: ToolItem[] = [
  { id: "tool-1", name: "Background Remover", href: "/ai/bg-remover", category: "AI Image Tools", enabled: true },
  { id: "tool-2", name: "Image Upscaler", href: "/image/upscaler", category: "AI Image Tools", enabled: true },
  { id: "tool-3", name: "AI OCR Reader", href: "/ai/ocr", category: "AI Image Tools", enabled: true },
  { id: "tool-4", name: "Image Editor", href: "/image/editor", category: "Image Tools", enabled: true },
  { id: "tool-5", name: "Format Converter", href: "/image/converter", category: "Image Tools", enabled: true },
  { id: "tool-6", name: "Compressor", href: "/image/compressor", category: "Image Tools", enabled: true },
  { id: "tool-7", name: "Image Blur Studio", href: "/image/blur", category: "Image Tools", enabled: true },
  { id: "tool-8", name: "Thumbnail Downloader", href: "/youtube/thumbnail", category: "YouTube Tools", enabled: true },
  { id: "tool-9", name: "Embed Generator", href: "/youtube/embed", category: "YouTube Tools", enabled: true },
  { id: "tool-10", name: "QR & Barcode", href: "/web/generators", category: "Web Tools", enabled: true },
  { id: "tool-11", name: "Developer Utilities", href: "/web/dev-utils", category: "Web Tools", enabled: true },
  { id: "tool-12", name: "Text Utilities", href: "/web/text-utils", category: "Web Tools", enabled: true },
  { id: "tool-13", name: "Color Tools", href: "/web/color-tools", category: "Web Tools", enabled: true },
  { id: "tool-14", name: "Color Converter & WCAG", href: "/web/color-converter", category: "Web Tools", enabled: true },
  { id: "tool-15", name: "Password Generator", href: "/web/password", category: "Web Tools", enabled: true },
  { id: "tool-16", name: "Word Counter", href: "/web/word-counter", category: "Web Tools", enabled: true }
];

const defaultSeo: SeoSettings = {
  metaTitle: "Cybro Tools - Fast, Secure, Client-Side Utilities",
  metaDescription: "A collection of powerful utilities running entirely in your browser. Fast, secure, and private background removal, image upscaler, secure password generator, and more.",
  keywords: "image converter, background remover, online tools, secure tools, utility hub",
  robotsTxt: "User-agent: *\nAllow: /\nSitemap: https://cybrotools.com/sitemap.xml",
  sitemapXml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://cybrotools.com/</loc>\n    <lastmod>2026-07-18</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>https://cybrotools.com/blog</loc>\n    <lastmod>2026-07-18</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`
};

const defaultSettings: WebSettings = {
  siteName: "Cybro Tools",
  siteDescription: "A collection of powerful utilities running entirely in your browser. Fast, secure, and private.",
  footerText: "Â© 2026 Cybro Tools. All tools run 100% locally in your browser. Your data never leaves your device.",
  analyticsId: "UA-CYBRO-12345"
};

const defaultLogs: AuditLog[] = [
  { id: "log-1", timestamp: new Date().toISOString(), action: "System Initialized", details: "Store initialized with default settings and layout configurations." }
];

function initStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_FILE)) {
    const initialData: StoreData = {
      posts: defaultPosts,
      categories: defaultCategories,
      media: [],
      seo: defaultSeo,
      tools: defaultTools,
      settings: defaultSettings,
      logs: defaultLogs
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initialData, null, 2), "utf8");
  }
}

export function getStore(): StoreData {
  initStore();
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to read admin store file, using default structure:", error);
    return {
      posts: defaultPosts,
      categories: defaultCategories,
      media: [],
      seo: defaultSeo,
      tools: defaultTools,
      settings: defaultSettings,
      logs: defaultLogs
    };
  }
}

export function saveStore(data: StoreData) {
  initStore();
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write to admin store file:", error);
  }
}

export function addAuditLog(action: string, details: string) {
  try {
    const store = getStore();
    const newLog: AuditLog = {
      id: "log-" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      action,
      details
    };
    store.logs = [newLog, ...store.logs].slice(0, 200);
    saveStore(store);
  } catch (error) {
    console.error("Failed to add audit log:", error);
  }
}
