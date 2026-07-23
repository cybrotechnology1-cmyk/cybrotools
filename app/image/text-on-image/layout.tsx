import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Text to Image | Free Online Photo Editor | Cybro Tools',
  description: 'Easily add text, titles, and captions to your photos online. Customize fonts, colors, and placement.',
  keywords: 'text on image, add text to photo, image text overlay, caption photo, watermark text, online tool',
  openGraph: {
    title: 'Add Text to Image | Free Online Photo Editor | Cybro Tools',
    description: 'Easily add text, titles, and captions to your photos online. Customize fonts, colors, and placement.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
