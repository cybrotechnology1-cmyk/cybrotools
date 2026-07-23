import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Circular Image Crop | Round Profile Picture Maker | Cybro Tools',
  description: 'Crop your images into perfect circles online for free. Ideal for profile pictures, avatars, and logos.',
  keywords: 'circular crop, round crop image, circle photo, circular image maker, profile picture maker, online crop tool',
  openGraph: {
    title: 'Circular Image Crop | Round Profile Picture Maker | Cybro Tools',
    description: 'Crop your images into perfect circles online for free. Ideal for profile pictures, avatars, and logos.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
