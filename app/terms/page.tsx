import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Cybro Tools. Learn about the rules and guidelines for using our free online tools.',
  openGraph: { title: 'Terms of Service | Cybro Tools', description: 'Terms of Service for Cybro Tools online tools.' },
  twitter: { title: 'Terms of Service | Cybro Tools', description: 'Terms of Service for Cybro Tools.' },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-6">Last updated: July 23, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-300 leading-relaxed">By accessing or using Cybro Tools (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
        <p className="text-gray-300 leading-relaxed">Cybro Tools provides free online tools for image processing, AI features, YouTube utilities, and web development. All processing is performed client-side in your browser unless explicitly stated otherwise.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>You agree not to misuse the Service for any illegal purposes</li>
          <li>You are responsible for any content you upload or process through our tools</li>
          <li>You must not attempt to disrupt or damage the Service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
        <p className="text-gray-300 leading-relaxed">The Service and its original content, features, and functionality are owned by Cybro Tools and are protected by applicable laws.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
        <p className="text-gray-300 leading-relaxed">Cybro Tools is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from the use of the Service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Changes to Terms</h2>
        <p className="text-gray-300 leading-relaxed">We reserve the right to modify these terms at any time. Changes are effective immediately upon posting.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
        <p className="text-gray-300 leading-relaxed">For questions about these Terms, contact us at <a href="mailto:support@cybrotools.xyz" className="text-blue-400 hover:underline">support@cybrotools.xyz</a>.</p>
      </section>
    </div>
  );
}
