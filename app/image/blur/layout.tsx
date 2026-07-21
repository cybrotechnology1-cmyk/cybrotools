import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Blur & Depth of Field Tool | Cybro Tools',
  description: 'Apply gorgeous depth of field, focal effects, and censor sensitive info using our secure, browser-based image blur studio. Free and private.',
  keywords: 'image blur, blur background, censor photo, blur tool, depth of field, bokeh effect, cybro tools',
  openGraph: {
    title: 'Free Image Blur & Depth of Field Tool | Cybro Tools',
    description: 'Apply gorgeous depth of field, focal effects, and censor sensitive info using our secure, browser-based image blur studio.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
