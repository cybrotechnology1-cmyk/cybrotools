import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Watermark to Image | Protect Photos Online | Cybro Tools',
  description: 'Protect your images by adding a custom watermark logo or text. Fast, secure, and free online tool.',
  keywords: 'watermark image, add watermark, photo watermark, image protection, copyright mark, online watermark tool',
  openGraph: {
    title: 'Add Watermark to Image | Protect Photos Online | Cybro Tools',
    description: 'Protect your images by adding a custom watermark logo or text. Fast, secure, and free online tool.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
