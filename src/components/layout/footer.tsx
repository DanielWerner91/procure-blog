import Link from 'next/link';
import Image from 'next/image';
import { Rss, Mail } from 'lucide-react';
import { SITE_NAME, SITE_DESCRIPTION, CATEGORIES } from '@/lib/constants';

function NewsletterSignup() {
  const beehiivUrl = process.env.NEXT_PUBLIC_BEEHIIV_SUBSCRIBE_URL;

  if (!beehiivUrl) return null;

  return (
    <div className="md:col-span-3 bg-accent/5 border border-accent/20 rounded-lg p-6 mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-accent" />
            Get the weekly digest
          </h4>
          <p className="text-[13px] text-muted-foreground">
            AI procurement news, funding rounds, and platform launches — delivered every Monday.
          </p>
        </div>
        <a
          href={beehiivUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors whitespace-nowrap"
        >
          Subscribe free
        </a>
      </div>
    </div>
  );
}

export function Footer() {
  const topCategories = CATEGORIES.slice(0, 6);

  return (
    <footer className="border-t border-border bg-secondary/50 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Newsletter signup — spans full width */}
          <NewsletterSignup />

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/logo.png"
                alt="procure.blog logo"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="text-sm font-semibold text-foreground">
                {SITE_NAME}
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xs">
              {SITE_DESCRIPTION}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Categories
            </h4>
            <ul className="space-y-2">
              {topCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Subscribe
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/feed.xml"
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  <Rss className="h-3 w-3" />
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by AI
          </p>
        </div>
      </div>
    </footer>
  );
}
