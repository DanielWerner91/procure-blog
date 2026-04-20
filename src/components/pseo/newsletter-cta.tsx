'use client';

import { useEffect, useRef, useState } from 'react';
import {
  trackCtaClick,
  trackCtaImpression,
  trackConversion,
} from './tracker';

type Placement = 'inflow' | 'sticky';

interface Props {
  placement: Placement;
  slug: string;
  label: string;
  category: string;
}

const CTA_ID_PREFIX = 'newsletter';

export function NewsletterCta({ placement, slug, label, category }: Props) {
  const ctaId = `${CTA_ID_PREFIX}_${placement}`;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackCtaImpression(ctaId, placement);
  }, [ctaId, placement]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    trackCtaClick(ctaId, placement);
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: `pseo_${slug}`,
          pseo: { slug, cta_placement: placement },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setError(typeof json.error === 'string' ? json.error : 'Subscription failed.');
        return;
      }
      setStatus('success');
      trackConversion(ctaId, placement, { slug });
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  }

  if (placement === 'inflow') {
    return (
      <section
        aria-label="Weekly procurement newsletter"
        className="my-8 rounded-lg border bg-muted/40 p-6"
      >
        <h3 className="text-lg font-semibold">
          Get weekly {label.toLowerCase()} moves, in plain English.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Join the procure.blog digest. Key {category} price shifts, what they mean for
          procurement, and three buyer-ready takeaways. Free, five minutes.
        </p>
        {status === 'success' ? (
          <p className="mt-4 rounded bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            You are in. Your first digest hits Tuesday at 9am ET.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor={`${ctaId}-email`}>
              Email address
            </label>
            <input
              id={`${ctaId}-email`}
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="flex-1 rounded border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Get the weekly digest'}
            </button>
          </form>
        )}
        {error && status === 'error' ? (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        ) : null}
      </section>
    );
  }

  return (
    <div
      role="complementary"
      aria-label="Newsletter subscribe"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 pr-10">
        <span className="hidden text-sm text-foreground sm:inline">
          Stay on top of {label.toLowerCase()} moves. Weekly digest.
        </span>
        {status === 'success' ? (
          <span className="ml-auto text-sm text-emerald-600">
            You are in. First digest Tuesday.
          </span>
        ) : (
          <form onSubmit={onSubmit} className="ml-auto flex flex-1 items-center gap-2 sm:flex-none">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="flex-1 rounded border px-2 py-1.5 text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded bg-foreground px-3 py-1.5 text-sm font-medium text-background disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
