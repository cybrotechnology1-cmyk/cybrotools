import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Downloader - Download HD, 4K Thumbnails | Cybro Tools",
  description: "Free YouTube thumbnail downloader online. Download YouTube thumbnail in HD, 4K, and full resolution. No signup, no watermark. Extract thumbnail from any YouTube video.",
  keywords: [
    "YouTube thumbnail downloader",
    "YouTube thumbnail downloader HD",
    "YouTube thumbnail downloader 4K",
    "download YouTube thumbnail",
    "download YouTube Shorts thumbnail",
  ],
  openGraph: {
    title: "YouTube Thumbnail Downloader - Download HD, 4K Thumbnails",
    description: "Free YouTube thumbnail downloader. Download YouTube thumbnail in HD, 4K, and full resolution. No signup, no watermark.",
    type: "website",
    siteName: "Cybro Tools",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
