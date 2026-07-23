import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Cybro Tools support team. Reach us via email for questions, feedback, or support requests.',
  openGraph: { title: 'Contact Cybro Tools', description: 'Get in touch with the Cybro Tools team.' },
  twitter: { title: 'Contact Cybro Tools', description: 'Get in touch with the Cybro Tools team.' },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-300 mb-8">Have questions, feedback, or need help? Reach out to us.</p>
      <div className="bg-[#0c0a25] border border-[#1f1a4e] rounded-2xl p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Email</h2>
          <a href="mailto:support@cybrotools.xyz" className="text-blue-400 hover:underline">support@cybrotools.xyz</a>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Response Time</h2>
          <p className="text-gray-400">We typically respond within 24-48 hours on business days.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Report an Issue</h2>
          <p className="text-gray-400">If you encounter a bug or have a suggestion, please email us with details about your issue. Screenshots are helpful.</p>
        </div>
      </div>
    </div>
  );
}
