import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for procure.blog. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to procure.blog
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: April 2026</p>

      <div className="space-y-8 text-[15px] leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
          <p>
            Welcome to procure.blog (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We are committed to
            protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard
            your information when you visit our website at{' '}
            <a href="https://procure.blog" className="text-accent hover:underline">
              procure.blog
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>

          <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
            2.1 Information You Provide
          </h3>
          <p className="mb-2">
            <strong>Newsletter and Waitlist Signup:</strong> When you subscribe to our newsletter or
            join our waitlist, we collect your email address. This is the only personal information
            we actively request from you.
          </p>

          <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
            2.2 Information Collected Automatically
          </h3>
          <p className="mb-2">
            <strong>Analytics Data:</strong> We use PostHog, a product analytics platform, to
            understand how visitors interact with our site. PostHog may collect:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-foreground/80">
            <li>Pages visited and time spent on each page</li>
            <li>Referring website or source</li>
            <li>Browser type and version</li>
            <li>Device type and screen resolution</li>
            <li>Approximate geographic location (country/region level)</li>
            <li>Interaction events (clicks, scrolls, form submissions)</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
            2.3 Cookies and Tracking Technologies
          </h3>
          <p>
            PostHog may set cookies on your browser to distinguish unique visitors and track sessions.
            These are functional and analytics cookies used solely to improve the site experience.
            We do not use advertising or third-party marketing cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
          <p className="mb-2">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-foreground/80">
            <li>Send you newsletters and updates about AI in procurement (if you subscribed)</li>
            <li>Analyze website usage patterns to improve our content and user experience</li>
            <li>Monitor site performance and diagnose technical issues</li>
            <li>Understand which articles and topics resonate with our audience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. AI-Generated Content</h2>
          <p>
            Content on procure.blog is generated with the assistance of artificial intelligence
            tools, including Perplexity for research and AI writing systems for article creation.
            While we review content for accuracy, articles are primarily produced by AI. We disclose
            this so you can make informed decisions about the information you consume on our site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Storage and Security</h2>
          <p className="mb-2">
            Your data is stored and processed using the following services:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-foreground/80">
            <li>
              <strong>Supabase:</strong> Your email address (if provided) is stored securely in our
              Supabase database, which provides encryption at rest and in transit.
            </li>
            <li>
              <strong>Vercel:</strong> Our website is hosted on Vercel, which handles web traffic
              and may process server logs including IP addresses.
            </li>
            <li>
              <strong>PostHog:</strong> Analytics data is processed and stored by PostHog in
              accordance with their privacy practices.
            </li>
          </ul>
          <p className="mt-2">
            We implement reasonable technical and organizational measures to protect your data.
            However, no method of electronic transmission or storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal information. We only share data with the
            third-party service providers listed above (Supabase, Vercel, PostHog) as necessary to
            operate the site. These providers act as data processors on our behalf.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights Under GDPR</h2>
          <p className="mb-2">
            If you are located in the European Economic Area (EEA), you have the following rights
            regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-foreground/80">
            <li>
              <strong>Right of Access:</strong> Request a copy of the personal data we hold about you.
            </li>
            <li>
              <strong>Right to Rectification:</strong> Request correction of inaccurate data.
            </li>
            <li>
              <strong>Right to Erasure:</strong> Request deletion of your personal data.
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> Request that we limit how we use your data.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> Request your data in a structured,
              machine-readable format.
            </li>
            <li>
              <strong>Right to Object:</strong> Object to our processing of your personal data.
            </li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:support@procure.blog" className="text-accent hover:underline">
              support@procure.blog
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Your Rights Under CCPA</h2>
          <p className="mb-2">
            If you are a California resident, you have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-foreground/80">
            <li>Know what personal information we collect and how it is used.</li>
            <li>Request deletion of your personal information.</li>
            <li>Opt out of the sale of your personal information (we do not sell your data).</li>
            <li>Non-discrimination for exercising your privacy rights.</li>
          </ul>
          <p className="mt-2">
            To exercise your CCPA rights, contact us at{' '}
            <a href="mailto:support@procure.blog" className="text-accent hover:underline">
              support@procure.blog
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">9. Data Retention</h2>
          <p>
            We retain your email address for as long as you remain subscribed to our newsletter.
            You may unsubscribe at any time, after which we will delete your email address within
            30 days. Analytics data is retained according to PostHog&apos;s standard retention
            policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">10. Children&apos;s Privacy</h2>
          <p>
            Our site is not directed at children under the age of 16. We do not knowingly collect
            personal information from children. If you believe a child has provided us with personal
            data, please contact us and we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated &quot;Last updated&quot; date. We encourage you to review this
            policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or your personal data, please
            contact us at{' '}
            <a href="mailto:support@procure.blog" className="text-accent hover:underline">
              support@procure.blog
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
