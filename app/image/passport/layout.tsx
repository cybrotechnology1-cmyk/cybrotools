import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Passport Photo Maker | Standard Visa Photo Creator | Cybro Tools',
  description: 'Make standard passport and visa photos online. Ensure correct dimensions and white backgrounds instantly.',
  keywords: 'passport, image tool, free online tool, cybro tools',
  openGraph: {
    title: 'Passport Photo Maker | Standard Visa Photo Creator | Cybro Tools',
    description: 'Make standard passport and visa photos online. Ensure correct dimensions and white backgrounds instantly.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
