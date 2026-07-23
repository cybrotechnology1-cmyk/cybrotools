import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Aspect Ratio Changer | Resize Photos Free | Cybro Tools',
  description: 'Change the aspect ratio of any image to fit Instagram, Facebook, or Twitter. Easy and free resizing tool.',
  keywords: 'aspect ratio converter, image ratio changer, resize aspect ratio, video aspect ratio, online aspect ratio tool',
  openGraph: {
    title: 'Image Aspect Ratio Changer | Resize Photos Free | Cybro Tools',
    description: 'Change the aspect ratio of any image to fit Instagram, Facebook, or Twitter. Easy and free resizing tool.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
