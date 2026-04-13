import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for procure.blog. Please read these terms carefully before using our site.',
};

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to procure.blog
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: April 2026</p>

      <div className="space-y-8 text-[15px] leading-relaxed text-foreground/90">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using procure.blog (&quot;the Site&quot;), you agree to be bound by
            these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please
            do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            2. AI-Generated Content Disclaimer
          </h2>
          <p className="mb-2">
            The content published on procure.blog is generated with the assistance of artificial
            intelligence, including AI-powered research tools and writing systems. You acknowledge
            and agree that:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-foreground/80">
            <li>
              Content may contain inaccuracies, errors, or outdated information despite our
              efforts to ensure quality.
            </li>
            <li>
              AI-generated content should not be relied upon as the sole basis for business,
              procurement, or financial decisions.
            </li>
            <li>
              We make no guarantees regarding the accuracy, completeness, or timeliness of any
              content on the Site.
            </li>
            <li>
              You are responsible for independently verifying any information before acting on it.
            </li>
          </ul>
          <p className="mt-2">
            The Site is intended for informational purposes only and does not constitute
            professional advice of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Intellectual Property</h2>
          <p className="mb-2">
            All content on procure.blog, including text, graphics, logos, images, and software, is
            the property of procure.blog or its content providers and is protected by applicable
            intellectual property laws.
          </p>
          <p className="mb-2">You may:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-foreground/80">
            <li>Read and share articles with proper attribution and a link to the original.</li>
            <li>Quote brief excerpts for commentary, criticism, or educational purposes.</li>
          </ul>
          <p className="mt-2 mb-2">You may not:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-foreground/80">
            <li>
              Reproduce, distribute, or republish substantial portions of our content without
              written permission.
            </li>
            <li>Use our content for commercial purposes without prior authorization.</li>
            <li>Remove or alter any copyright or attribution notices.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Acceptable Use</h2>
          <p className="mb-2">When using the Site, you agree not to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-foreground/80">
            <li>
              Use automated tools (bots, scrapers, crawlers) to extract content in bulk without
              prior written consent.
            </li>
            <li>
              Attempt to interfere with the Site&apos;s operation, security, or infrastructure.
            </li>
            <li>
              Submit false, misleading, or spam content through any forms on the Site.
            </li>
            <li>Use the Site for any unlawful purpose or in violation of any applicable laws.</li>
            <li>
              Impersonate any person or entity, or misrepresent your affiliation with any person
              or entity.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Newsletter and Email</h2>
          <p>
            By subscribing to our newsletter or joining our waitlist, you consent to receiving
            periodic emails about AI in procurement news and updates. You may unsubscribe at any
            time by following the unsubscribe link in any email or by contacting us at{' '}
            <a href="mailto:support@procure.blog" className="text-accent hover:underline">
              support@procure.blog
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Third-Party Links</h2>
          <p>
            Our articles may contain links to third-party websites and resources. These links are
            provided for your convenience and informational purposes only. We do not endorse and are
            not responsible for the content, accuracy, or practices of any third-party sites. You
            access third-party sites at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Disclaimer of Warranties</h2>
          <p>
            The Site and all content are provided &quot;as is&quot; and &quot;as available&quot;
            without warranties of any kind, whether express or implied. We disclaim all warranties,
            including but not limited to implied warranties of merchantability, fitness for a
            particular purpose, and non-infringement. We do not warrant that the Site will be
            uninterrupted, error-free, or free of harmful components.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, procure.blog and its operators shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages arising
            out of or related to your use of the Site or reliance on any content. This includes,
            without limitation, damages for loss of profits, data, business opportunities, or
            goodwill. Our total liability for any claim arising from these Terms or your use of the
            Site shall not exceed the amount you paid to us in the preceding 12 months (if any).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless procure.blog and its operators from
            any claims, damages, losses, liabilities, and expenses (including legal fees) arising
            out of your use of the Site, your violation of these Terms, or your violation of any
            rights of a third party.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            Federal Republic of Germany, without regard to its conflict of law provisions. Any
            disputes arising from these Terms or your use of the Site shall be subject to the
            exclusive jurisdiction of the courts in Germany.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">11. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be posted on this
            page with an updated &quot;Last updated&quot; date. Your continued use of the Site
            after changes are posted constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">12. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision
            will be limited or eliminated to the minimum extent necessary so that the remaining
            Terms remain in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">13. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{' '}
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
