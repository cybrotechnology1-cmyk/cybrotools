import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Online Tools Tips & Guides | Cybro Tools',
  description: 'Read our blog for tips, guides, and insights about online tools, image processing, AI, and web development.',
  keywords: 'blog, online tools blog, image processing guide, ai tools, web dev tips, cybro tools',
  openGraph: {
    title: 'Blog - Online Tools Tips & Guides | Cybro Tools',
    description: 'Read our blog for tips, guides, and insights about online tools, image processing, AI, and web development.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
