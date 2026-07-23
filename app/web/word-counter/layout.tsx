import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Word Counter - Count Characters & Words | Cybro Tools',
  description: 'Free online word counter and character counter. Count words, characters, sentences, and paragraphs instantly.',
  keywords: 'word counter, character counter, word count, online counter, text analyzer, free tool',
  openGraph: {
    title: 'Free Word Counter - Count Characters & Words | Cybro Tools',
    description: 'Free online word counter and character counter. Count words, characters, sentences, and paragraphs instantly.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
