import type {Metadata} from 'next';
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
  other: {
    'google-site-verification': 'ow3p7-sAgz1nmc4oLvtLKoM1B97TfQjJBdiicaxrXyg',
    'monetag': 'ba839a44023faec4820c9e220a9bf067',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#04030a] text-gray-100 min-h-screen flex flex-col`} suppressHydrationWarning>
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
      </body>
    </html>
  );
}
