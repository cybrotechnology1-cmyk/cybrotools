import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ID Photo Maker Online - Create ID Photo Without Uploading | Cybro Tools',
  description: 'Free ID photo maker online. Create ID photo without uploading to servers. No uploads, no watermark. ID photo background remover included.',
  keywords: [
    'ID photo maker online',
    'create ID photo online',
    'ID photo maker no upload',
    'private ID photo maker',
    'ID photo background remover',
    'biometric photo maker',
  ],
  openGraph: {
    title: 'ID Photo Maker Online - Create ID Photo Without Uploading',
    description: 'Free ID photo maker. Create ID photo without uploading. No uploads, no watermark.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
