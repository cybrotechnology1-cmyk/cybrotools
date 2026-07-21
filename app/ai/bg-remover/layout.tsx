import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Background Remover | Cybro Tools',
  description: 'Remove image backgrounds instantly in your browser using AI. 100% free, secure, and private. No watermark, high quality.',
  keywords: 'background remover, ai background remover, free background remover, remove bg, transparent background, cybro tools',
  openGraph: {
    title: 'Free AI Background Remover | Cybro Tools',
    description: 'Remove image backgrounds instantly in your browser using AI. 100% free, secure, and private.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
