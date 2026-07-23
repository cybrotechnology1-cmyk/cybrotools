import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Generators - QR, Barcode & More | Cybro Tools',
  description: 'Free online generators for QR codes, barcodes, and more. Instant, browser-based, no uploads required.',
  keywords: 'qr code generator, barcode generator, online generator, free tool, web utility',
  openGraph: {
    title: 'Free Online Generators - QR, Barcode & More | Cybro Tools',
    description: 'Free online generators for QR codes, barcodes, and more. Instant, browser-based, no uploads required.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
