import Link from 'next/link';
import { Rss } from 'lucide-react';
import { SITE_NAME, CATEGORIES } from '@/lib/constants';

export function Header() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">{SITE_NAME}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <div className="relative group">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/feed.xml"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="RSS Feed"
            >
              <Rss className="h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-4">
            <Link
              href="/feed.xml"
              className="text-muted-foreground hover:text-foreground"
            >
              <Rss className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
