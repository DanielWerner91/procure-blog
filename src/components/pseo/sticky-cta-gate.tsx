'use client';

import { useEffect, useState } from 'react';
import { NewsletterCta } from './newsletter-cta';

interface Props {
  slug: string;
  label: string;
}

// Fires the sticky CTA only after 50% scroll OR first chart/table interaction,
// whichever comes first. Matches research-backed trigger rule from the skill.
export function StickyCtaGate({ slug, label }: Props) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const key = `pseo_sticky_dismissed_${slug}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(key) === '1') {
      setDismissed(true);
      return;
    }

    function reveal() {
      setShow(true);
    }

    function onScroll() {
      const sh = document.documentElement.scrollHeight;
      if (sh <= 0) return;
      const pct = ((window.scrollY + window.innerHeight) / sh) * 100;
      if (pct >= 50) {
        reveal();
        window.removeEventListener('scroll', onScroll);
      }
    }

    function onPseoEngage() {
      reveal();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pseo:engage', onPseoEngage as EventListener);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pseo:engage', onPseoEngage as EventListener);
    };
  }, [slug]);

  function onDismiss() {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`pseo_sticky_dismissed_${slug}`, '1');
    }
  }

  if (!show || dismissed) return null;

  return (
    <div className="relative">
      <NewsletterCta placement="sticky" slug={slug} label={label} />
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="fixed bottom-3 right-3 z-50 rounded-full border bg-background/95 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        ×
      </button>
    </div>
  );
}
