import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Converter | Change Image Format | Cybro Tools',
  description: 'Convert images between JPG, PNG, WEBP, and more formats instantly in your browser. Fast, free, and private.',
  keywords: 'converter, image tool, free online tool, cybro tools',
  openGraph: {
    title: 'Free Image Converter | Change Image Format | Cybro Tools',
    description: 'Convert images between JPG, PNG, WEBP, and more formats instantly in your browser. Fast, free, and private.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
