import type {Metadata} from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { Suspense } from "react";
import { AuthProvider } from '@/components/AuthProvider';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import PrivacyBanner from '@/components/PrivacyBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const baseUrl = 'https://cybrotools.xyz';

export const metadata: Metadata = {
  title: {
    default: 'Cybro Tools | Free Online Image, AI & Web Tools',
    template: '%s | Cybro Tools',
  },
  description: 'Free online tools for image editing, AI background removal, YouTube thumbnail download, password generator, and more. Fast, secure, and private browser-based tools.',
  keywords: 'online tools, image editor, background remover, AI tools, YouTube thumbnail downloader, password generator, free web tools, image compressor',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.jpg',
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Cybro Tools | Free Online Image, AI & Web Tools',
    description: 'Free online tools for image editing, AI background removal, YouTube thumbnail download, password generator, and more. Fast, secure, and private browser-based tools.',
    url: baseUrl,
    siteName: 'Cybro Tools',
    images: [
      {
        url: '/logo.jpg',
        width: 512,
        height: 512,
        alt: 'Cybro Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cybro Tools | Free Online Image, AI & Web Tools',
    description: 'Free online tools for image editing, AI background removal, YouTube thumbnail download, password generator, and more.',
    images: ['/logo.jpg'],
    creator: '@cybrotools',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
  },
  other: {
    'google-site-verification': 'ow3p7-sAgz1nmc4oLvtLKoM1B97TfQjJBdiicaxrXyg',
    'theme-color': '#3b82f6',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={baseUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Cybro Tools',
              url: baseUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${baseUrl}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Cybro Tools',
              url: baseUrl,
              logo: `${baseUrl}/logo.jpg`,
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'support@cybrotools.xyz',
                contactType: 'customer support',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#04030a] text-gray-100 min-h-screen flex flex-col`} suppressHydrationWarning>
        <Script id="monetag-push" src="https://5gvci.com/act/files/tag.min.js?z=11366986" strategy="beforeInteractive" />
        <AuthProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Suspense fallback={<div className="h-16 bg-[#080712]/90 border-b border-[#151426]" />}>
                <Header />
              </Suspense>
              <main className="flex-1 overflow-x-hidden">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
        <Script id="register-sw" strategy="lazyOnload">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', { scope: '/' });
          }
        `}</Script>
        <PrivacyBanner />
      </body>
    </html>
  );
}
