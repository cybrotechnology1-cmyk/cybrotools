import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Splitter & Grid Maker | Cybro Tools',
  description: 'Split single photos into perfect grids or columns for Instagram, panoramas, and social media. 100% free, fast, and secure client-side processing.',
  keywords: 'image splitter, grid maker, instagram grid, split photo, split image online, cybro tools',
  openGraph: {
    title: 'Free Image Splitter & Grid Maker | Cybro Tools',
    description: 'Split single photos into perfect grids or columns for Instagram, panoramas, and social media. 100% free.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
