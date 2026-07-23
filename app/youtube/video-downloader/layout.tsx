import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free YouTube Video ID Finder | Cybro Tools',
  description: 'Extract YouTube video IDs, thumbnails, and embed codes instantly. Free online YouTube utility tool.',
  keywords: 'youtube video id, video id finder, youtube extractor, youtube tool, free online',
  openGraph: {
    title: 'Free YouTube Video ID Finder | Cybro Tools',
    description: 'Extract YouTube video IDs, thumbnails, and embed codes instantly. Free online YouTube utility tool.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
