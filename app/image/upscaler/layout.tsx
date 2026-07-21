import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Image Upscaler & Enhancer | Cybro Tools',
  description: 'Enhance image resolution and reconstruct fine textures using Neural Networks. Upscale low-res photos up to 4x quality for free.',
  keywords: 'ai upscaler, image upscaler, enhance photo resolution, upscale image, free ai enhancer, cybro tools',
  openGraph: {
    title: 'Free AI Image Upscaler & Enhancer | Cybro Tools',
    description: 'Enhance image resolution and reconstruct fine textures using Neural Networks. Upscale low-res photos up to 4x quality for free.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
