import type {Metadata} from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { Suspense } from "react";
import { AuthProvider } from '@/components/AuthProvider';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Cybro Tools | Fast & Private Browser Tools',
  description: 'Production-grade tools running entirely in your browser. Secure, fast, and private.',
  keywords: 'browser tools, AI, privacy, background removal, youtube thumbnail, password generator',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.jpg',
  },
  other: {
    'google-site-verification': 'ow3p7-sAgz1nmc4oLvtLKoM1B97TfQjJBdiicaxrXyg',
    'monetag': 'ba839a44023faec4820c9e220a9bf067',
    'theme-color': '#3b82f6',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#04030a] text-gray-100 min-h-screen flex flex-col`} suppressHydrationWarning>
        <Script id="monetag-push" src="https://5gvci.com/act/files/tag.min.js?z=11366986" strategy="beforeInteractive" />
        <Script id="monetag-inpage" strategy="afterInteractive">{`(function(s){s.dataset.zone='11367106',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}</Script>
        <Script id="monetag-vignette" strategy="afterInteractive">{`(function(s){s.dataset.zone='11367117',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}</Script>
        <Script id="monetag-popunder" strategy="afterInteractive">{`(function(s){s.dataset.zone='11367153',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}</Script>
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
      </body>
    </html>
  );
}
