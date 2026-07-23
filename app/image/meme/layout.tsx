import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Meme Generator | Create Memes Online | Cybro Tools',
  description: 'Generate custom memes by adding text to images. Quick, easy, and free online meme maker with templates.',
  keywords: 'meme generator, create meme, meme maker, add text to image, funny meme creator, online meme tool',
  openGraph: {
    title: 'Free Meme Generator | Create Memes Online | Cybro Tools',
    description: 'Generate custom memes by adding text to images. Quick, easy, and free online meme maker with templates.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
