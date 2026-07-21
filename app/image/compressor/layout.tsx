import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Compressor | Reduce Image Size Online | Cybro Tools',
  description: 'Compress JPG, PNG, WEBP images without losing quality. 100% free, fast, and secure client-side browser compression.',
  keywords: 'compressor, image tool, free online tool, cybro tools',
  openGraph: {
    title: 'Free Image Compressor | Reduce Image Size Online | Cybro Tools',
    description: 'Compress JPG, PNG, WEBP images without losing quality. 100% free, fast, and secure client-side browser compression.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
