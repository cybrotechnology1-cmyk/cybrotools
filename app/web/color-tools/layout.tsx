import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Color Tools - Palette, Converter & Picker | Cybro Tools',
  description: 'Free online color tools. Color converter, palette generator, and more. Convert HEX, RGB, HSL instantly.',
  keywords: 'color picker, hex converter, rgb to hex, color palette, color tools, free tool',
  openGraph: {
    title: 'Free Color Tools - Palette, Converter & Picker | Cybro Tools',
    description: 'Free online color tools. Color converter, palette generator, and more. Convert HEX, RGB, HSL instantly.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
