import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Channel ID Finder | Free Online Channel Extractor | Cybro Tools",
  description: "Find the unique 24-character YouTube Channel ID (starting with UC) from any channel URL, @handle, username, or video link instantly. Safe, fast, and 100% free.",
  keywords: "youtube channel id finder, find channel id, youtube channel extractor, get channel id, youtube uc id, channel identifier, free online tool, cybro tools",
  openGraph: {
    title: "YouTube Channel ID Finder | Free Online Channel Extractor | Cybro Tools",
    description: "Find the unique 24-character YouTube Channel ID (starting with UC) from any channel URL, @handle, username, or video link instantly. Safe, fast, and 100% free.",
    type: "website",
    siteName: "Cybro Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Channel ID Finder | Free Online Channel Extractor | Cybro Tools",
    description: "Find the unique 24-character YouTube Channel ID (starting with UC) from any channel URL, @handle, username, or video link instantly. Safe, fast, and 100% free.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
