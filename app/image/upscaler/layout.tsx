import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Image Upscaler - Enhance Resolution Without Uploading | Cybro Tools',
  description: 'Free AI image upscaler online. Enhance image resolution without uploading to servers. No uploads, runs 100% in your browser. Upscale to 4K, make HD.',
  keywords: [
    'AI image upscaler',
    'image upscaler',
    'upscale image without losing quality',
    'increase image resolution',
    'AI photo enhancer',
    'enlarge image with AI',
    'private AI image upscaler',
    'offline AI image upscaler',
  ],
  openGraph: {
    title: 'AI Image Upscaler - Enhance Resolution Without Uploading',
    description: 'Free AI image upscaler. Enhance image resolution without uploading. No uploads, runs in your browser.',
    type: 'website',
  },
};

export default function UpscalerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
