import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Video ID Finder - Find Video ID from URL | Cybro Tools",
  description: "Free YouTube video ID finder online. Find YouTube video ID from any URL, Shorts, or youtu.be link. No signup, runs 100% in your browser. Also generates embed code.",
  keywords: [
    "YouTube Video ID Finder",
    "find YouTube video ID",
    "YouTube video ID from URL",
    "extract YouTube video ID",
    "YouTube URL to video ID",
  ],
  openGraph: {
    title: "YouTube Video ID Finder - Find Video ID from URL",
    description: "Free YouTube video ID finder. Find YouTube video ID from any URL. No signup, runs in your browser.",
    type: "website",
    siteName: "Cybro Tools",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
