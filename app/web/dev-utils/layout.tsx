import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Developer Utilities - Free Online Tools | Cybro Tools',
  description: 'Free online utilities for web developers. Includes hashing, encoding, formatting, and conversion tools.',
  keywords: 'web dev tools, developer utilities, online converter, code formatter, free web tool',
  openGraph: {
    title: 'Web Developer Utilities - Free Online Tools | Cybro Tools',
    description: 'Free online utilities for web developers. Includes hashing, encoding, formatting, and conversion tools.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
