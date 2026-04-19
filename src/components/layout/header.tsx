'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Rss, Menu, X, ChevronDown, BarChart3, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { SITE_NAME, CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const TOOLS = [
  {
    name: 'ProcureIndex',
    description: 'Price intelligence & should-cost models',
    href: process.env.NEXT_PUBLIC_PROCURE_INDEX_URL || 'https://index.procure.blog',
    icon: BarChart3,
    external: true,
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo-procure-blog-light-transparent.png"
              alt="procure.blog logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-[15px] font-semibold text-foreground tracking-tight">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                'px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors',
                pathname === '/'
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              Latest
            </Link>

            {/* Categories dropdown */}
            <div className="relative group">
              <button
                className={cn(
                  'px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors flex items-center gap-1',
                  pathname.startsWith('/category')
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                Categories
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-52 bg-card border border-border rounded-xl shadow-lg shadow-black/5 p-1.5">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className={cn(
                        'block px-3 py-2 text-[13px] rounded-lg transition-colors',
                        pathname === `/category/${cat.slug}`
                          ? 'text-foreground bg-muted font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      )}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Tools dropdown */}
            <div className="relative group">
              <button className="px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors flex items-center gap-1 text-muted-foreground hover:text-foreground hover:bg-muted/60">
                Tools
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-72 bg-card border border-border rounded-xl shadow-lg shadow-black/5 p-1.5">
                  {TOOLS.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.href}
                      target={tool.external ? '_blank' : undefined}
                      rel={tool.external ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/60 group/tool"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center shrink-0 mt-0.5">
                        <tool.icon className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-medium text-foreground">{tool.name}</span>
                          {tool.external && <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover/tool:opacity-100 transition-opacity" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">{tool.description}</p>
                      </div>
                    </a>
                  ))}
                  <div className="border-t border-border/60 mt-1 pt-1">
                    <div className="px-3 py-2 text-[11px] text-muted-foreground">
                      Free procurement tools by procure.blog
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/feed.xml"
              className="ml-2 p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/60 transition-colors"
              title="RSS Feed"
            >
              <Rss className="h-3.5 w-3.5" />
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground rounded-md"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted"
            >
              Latest
            </Link>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted"
            >
              Categories
              <ChevronDown className={cn('h-4 w-4 transition-transform', catOpen && 'rotate-180')} />
            </button>
            {catOpen && (
              <div className="pl-3 space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Tools in mobile */}
            <div className="border-t border-border/40 pt-2 mt-2">
              <div className="px-3 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Tools</div>
              {TOOLS.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.href}
                  target={tool.external ? '_blank' : undefined}
                  rel={tool.external ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted"
                >
                  <tool.icon className="h-4 w-4 text-accent" />
                  {tool.name}
                  {tool.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                </a>
              ))}
            </div>

            <Link
              href="/feed.xml"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted"
            >
              <Rss className="h-3.5 w-3.5" />
              RSS Feed
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
