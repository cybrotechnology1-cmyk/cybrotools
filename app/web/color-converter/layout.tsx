import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Color Converter - HEX to RGB to HSL | Cybro Tools',
  description: 'Convert colors between HEX, RGB, HSL, and more formats instantly. Free online color converter tool.',
  keywords: 'color converter, hex to rgb, rgb to hex, hsl converter, color code converter, free tool',
  openGraph: {
    title: 'Free Color Converter - HEX to RGB to HSL | Cybro Tools',
    description: 'Convert colors between HEX, RGB, HSL, and more formats instantly. Free online color converter tool.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
