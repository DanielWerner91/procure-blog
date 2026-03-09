import Link from 'next/link';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="max-w-sm">
            <h3 className="font-bold text-foreground">{SITE_NAME}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {SITE_DESCRIPTION}
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <h4 className="text-sm font-semibold mb-2">Navigation</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/feed.xml"
                    className="hover:text-foreground transition-colors"
                  >
                    RSS Feed
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
