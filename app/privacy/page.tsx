"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">&larr; Back to Home</Link>
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-6">Last updated: July 23, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p className="text-gray-300 leading-relaxed">
          Cybro Tools ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at <strong>cybrotools.xyz</strong>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
        <p className="text-gray-300 leading-relaxed mb-3">We collect minimal information to operate and improve our services:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li><strong>Cookies &amp; Tracking:</strong> We use cookies and similar tracking technologies to enhance your experience, analyze usage, and serve ads via Monetag.</li>
          <li><strong>Usage Data:</strong> Anonymous usage statistics (pages visited, time spent) are collected to improve our tools.</li>
          <li><strong>Uploaded Images:</strong> Images you upload for processing are handled entirely in your browser. We do not store or transmit your images to our servers unless explicitly stated (e.g., AI features).</li>
          <li><strong>Authentication Data:</strong> If you create an account, we store your email and display name via Firebase Authentication.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>To provide, operate, and maintain our tools and services</li>
          <li>To improve user experience and develop new features</li>
          <li>To serve relevant advertisements via third-party ad networks</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
        <p className="text-gray-300 leading-relaxed mb-3">We use the following third-party services:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li><strong>Monetag</strong> &ndash; Advertising network. View their privacy policy at <a href="https://monetag.com/privacy.html" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">monetag.com/privacy</a>.</li>
          <li><strong>Firebase (Google)</strong> &ndash; Authentication, database, and hosting. View at <a href="https://policies.google.com/privacy" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.</li>
          <li><strong>Vercel</strong> &ndash; Hosting platform. View at <a href="https://vercel.com/privacy" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">vercel.com/privacy</a>.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
        <p className="text-gray-300 leading-relaxed">
          Cookies are small text files placed on your device. We use cookies for analytics and advertising. You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of our site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
        <p className="text-gray-300 leading-relaxed">
          We implement appropriate security measures to protect your data. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
        <p className="text-gray-300 leading-relaxed mb-3">Depending on your location, you may have the right to:</p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Access, update, or delete your personal data</li>
          <li>Withdraw consent at any time</li>
          <li>Opt out of cookies and targeted advertising</li>
          <li>File a complaint with your local data protection authority</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
        <p className="text-gray-300 leading-relaxed">
          If you have questions about this Privacy Policy, please contact us at:<br />
          <a href="mailto:support@cybrotools.xyz" className="text-blue-400 hover:underline">support@cybrotools.xyz</a>
        </p>
      </section>
    </div>
  );
}
