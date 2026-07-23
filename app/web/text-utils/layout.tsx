import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Text Utilities - Counter, Replacer & More | Cybro Tools',
  description: 'Free online text utilities. Word counter, character counter, text replacer, case converter and more.',
  keywords: 'text utility, word counter, character counter, text converter, online text tool, free',
  openGraph: {
    title: 'Free Text Utilities - Counter, Replacer & More | Cybro Tools',
    description: 'Free online text utilities. Word counter, character counter, text replacer, case converter and more.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
