import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ID Photo Maker | Free Passport Photo Creator | Cybro Tools',
  description: 'Create professional ID photos for school, work, or official use. Ensure perfect sizing and alignment online.',
  keywords: 'id-photo, image tool, free online tool, cybro tools',
  openGraph: {
    title: 'ID Photo Maker | Free Passport Photo Creator | Cybro Tools',
    description: 'Create professional ID photos for school, work, or official use. Ensure perfect sizing and alignment online.',
    type: 'website',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
