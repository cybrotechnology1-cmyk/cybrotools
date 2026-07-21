import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Round Image Corners | Free Online Tool | Cybro Tools',
  description: 'Quickly round the corners of your images online. Add smooth curves to any picture for free.',
  keywords: 'rounded-corners, image tool, free online tool, cybro tools',
  openGraph: {
    title: 'Round Image Corners | Free Online Tool | Cybro Tools',
    description: 'Quickly round the corners of your images online. Add smooth curves to any picture for free.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
