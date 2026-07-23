import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Background Remover - Remove Background Without Uploading | Cybro Tools',
  description: 'Free AI background remover online. Remove background from image without uploading to servers. No uploads, no servers — runs 100% in your browser. Private, local, offline.',
  keywords: [
    'AI background remover',
    'remove background from image',
    'background remover without uploading',
    'private AI background remover',
    'offline AI background remover',
    'local AI background remover',
    'browser based background removal',
    'zero upload background remover',
  ],
  openGraph: {
    title: 'AI Background Remover - Remove Background Without Uploading',
    description: 'Free AI background remover. Remove background from image without uploading. No uploads, no servers — runs 100% in your browser.',
    type: 'website',
  },
};

export default function BgRemoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
