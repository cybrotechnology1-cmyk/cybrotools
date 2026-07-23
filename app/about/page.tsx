import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Cybro Tools provides free, private, and fast browser-based tools for image processing, AI features, YouTube utilities, and web development. All processing happens client-side.',
  openGraph: { title: 'About Cybro Tools | Free Online Tools', description: 'Learn about Cybro Tools - free, private, client-side browser tools for image editing, AI, and web development.' },
  twitter: { title: 'About Cybro Tools | Free Online Tools', description: 'Learn about Cybro Tools - free, private, client-side browser tools.' },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About Cybro Tools</h1>
      <div className="space-y-4 text-gray-300 leading-relaxed">
        <p>Cybro Tools is a collection of free, privacy-first online tools designed to help creators, developers, and everyday users accomplish common tasks quickly and securely.</p>
        <p>Every tool runs entirely in your browser. Your images, text, and data never leave your device. No server uploads, no storage, no tracking.</p>
        <p>We believe online tools should be fast, private, and accessible to everyone. That is why we built Cybro Tools with a client-first architecture using modern web technologies.</p>
        <h2 className="text-xl font-semibold text-white mt-8 mb-3">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>AI Background Removal (100% client-side)</li>
          <li>Image Editor, Compressor, Converter, Blur & more</li>
          <li>YouTube Thumbnail Downloader & Channel Finder</li>
          <li>Password Generator, Color Tools, Text Utilities</li>
          <li>QR Code Generator & Web Dev Utilities</li>
        </ul>
        <h2 className="text-xl font-semibold text-white mt-8 mb-3">Our Mission</h2>
        <p>To provide powerful, production-grade tools that respect your privacy and run at the speed of your browser.</p>
      </div>
    </div>
  );
}
