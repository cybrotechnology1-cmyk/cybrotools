import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Password Generator - Strong & Secure | Cybro Tools',
  description: 'Generate strong, cryptographically secure passwords instantly in your browser. Custom length, symbols, numbers, and uppercase options. 100% client-side.',
  keywords: 'password generator, secure password, random password, strong password, crypto secure, free tool',
  openGraph: {
    title: 'Free Password Generator - Strong & Secure | Cybro Tools',
    description: 'Generate strong, cryptographically secure passwords instantly in your browser. Custom length, symbols, numbers, and uppercase options. 100% client-side.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
