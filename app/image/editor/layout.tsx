import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Photo Editor | Image Editing Tool | Cybro Tools',
  description: 'Edit your photos online with our free image editor. Crop, rotate, apply filters, and adjust colors securely in your browser.',
  keywords: 'editor, image tool, free online tool, cybro tools',
  openGraph: {
    title: 'Free Online Photo Editor | Image Editing Tool | Cybro Tools',
    description: 'Edit your photos online with our free image editor. Crop, rotate, apply filters, and adjust colors securely in your browser.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
