import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI OCR Image to Text - Extract Text Without Uploading | Cybro Tools',
  description: 'Free AI OCR reader online. Extract text from image without uploading to servers. No uploads, runs 100% in your browser. Supports handwritten text, tables, and documents.',
  keywords: [
    'AI OCR image to text',
    'extract text from image',
    'OCR without uploading image',
    'private OCR online',
    'offline OCR tool',
    'local OCR in browser',
    'screenshot to text',
    'image to text converter',
  ],
  openGraph: {
    title: 'AI OCR Image to Text - Extract Text Without Uploading',
    description: 'Free AI OCR reader. Extract text from image without uploading. No uploads, runs in your browser.',
    type: 'website',
  },
};

export default function OcrLayout({ children }: { children: React.ReactNode }) {
  return children;
}
