'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const DISMISS_KEY = 'procure-index-popup-dismissed';
const SHOW_AFTER_MS = 6000;

export function ShouldCostPromo() {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const procureIndexUrl = process.env.NEXT_PUBLIC_PROCURE_INDEX_URL || 'https://index.procure.blog';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem(DISMISS_KEY) === '1') return;

    const t = window.setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setEntered(true));
    }, SHOW_AFTER_MS);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    setEntered(false);
    window.setTimeout(() => setMounted(false), 300);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {}
  };

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-label="New product announcement"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 300ms ease, transform 300ms ease',
      }}
      className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:bottom-6 sm:right-6"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/10">
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-4 pr-10">
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
            New · ProcureIndex
          </div>
          <div className="text-[14px] font-semibold text-foreground leading-snug">
            Build your own should-cost model. Free.
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
            Map supplier quotes to 1,900+ live price indices and see what the price <em>should</em> be.
          </p>

          <Link
            href={`${procureIndexUrl}/model`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            Try it free
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
