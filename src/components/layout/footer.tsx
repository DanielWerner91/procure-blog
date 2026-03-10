import Link from 'next/link';
import { Rss } from 'lucide-react';
import { SITE_NAME, SITE_DESCRIPTION, CATEGORIES } from '@/lib/constants';

export function Footer() {
  const topCategories = CATEGORIES.slice(0, 6);

  return (
    <footer className="border-t border-border bg-secondary/50 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground text-xs font-bold">
                AI
              </div>
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
