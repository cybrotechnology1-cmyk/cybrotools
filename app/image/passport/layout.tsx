import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Passport Photo Maker Online - Create Passport Photo Without Uploading | Cybro Tools',
  description: 'Free passport photo maker online. Create passport photo without uploading to servers. No uploads, no watermark. Passport photo background remover included.',
  keywords: [
    'passport photo maker online',
    'passport size photo maker',
    'create passport photo online',
    'passport photo maker no upload',
    'private passport photo maker',
    'passport photo background remover',
  ],
  openGraph: {
    title: 'Passport Photo Maker Online - Create Passport Photo Without Uploading',
    description: 'Free passport photo maker. Create passport photo without uploading. No uploads, no watermark.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
