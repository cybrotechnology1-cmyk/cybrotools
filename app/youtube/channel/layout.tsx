import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Channel ID Finder - Find YouTube Channel ID from URL | Cybro Tools",
  description: "Free YouTube channel ID finder online. Find YouTube channel ID from any URL, handle, or video link. No signup, runs 100% in your browser. Instant extraction.",
  keywords: [
    "YouTube channel ID finder",
    "find YouTube channel ID",
    "YouTube channel ID extractor",
    "get YouTube channel ID",
    "channel ID from URL",
    "YouTube channel URL to ID",
  ],
  openGraph: {
    title: "YouTube Channel ID Finder - Find YouTube Channel ID from URL",
    description: "Free YouTube channel ID finder. Find YouTube channel ID from any URL, handle, or video link. No signup, runs in your browser.",
    type: "website",
    siteName: "Cybro Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Channel ID Finder - Find YouTube Channel ID from URL",
    description: "Free YouTube channel ID finder. Find YouTube channel ID from any URL, handle, or video link. No signup, runs in your browser.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
