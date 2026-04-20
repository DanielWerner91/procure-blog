'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';
import { classifyTraffic } from '@/lib/pseo/analytics';

interface Props {
  slug: string;
  category: string;
  indexId: string;
  country: string;
  region: string;
}

export function PseoTracker({ slug, category, indexId, country, region }: Props) {
  const path = usePathname();
  const fired = useRef({ s25: false, s50: false, s75: false, s90: false });
  const landingAt = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !posthog.__loaded) return;

    posthog.register({
      page_type: 'pseo',
      pseo_category: category,
      pseo_slug: slug,
      pseo_index_id: indexId,
      pseo_country: country,
      pseo_region: region,
    });

    const ref = document.referrer;
    const search = new URLSearchParams(window.location.search);
    const { channel, ai_source } = classifyTraffic(ref, search.get('utm_source'));
    const query = search.get('q') ?? search.get('query') ?? null;

    landingAt.current = performance.now();

    posthog.capture('pseo_landing', {
      traffic_channel: channel,
      ai_source,
      search_query: query,
      referrer: ref,
      is_organic: channel === 'organic_search' || channel === 'ai',
    });

    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollHeight <= 0) return;
      const pct = ((window.scrollY + window.innerHeight) / scrollHeight) * 100;
      ([25, 50, 75, 90] as const).forEach((d) => {
        const k = `s${d}` as const;
        if (pct >= d && !fired.current[k]) {
          fired.current[k] = true;
          posthog.capture('pseo_scroll', {
            depth: d,
            ms_since_landing: Math.round(performance.now() - landingAt.current),
          });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      // Clear super props so non-pSEO pages don't inherit them
      posthog.unregister('page_type');
      posthog.unregister('pseo_category');
      posthog.unregister('pseo_slug');
      posthog.unregister('pseo_index_id');
      posthog.unregister('pseo_country');
      posthog.unregister('pseo_region');
    };
  }, [path, slug, category, indexId, country, region]);

  return null;
}

export function trackEngage(
  surface: 'chart' | 'table' | 'filter',
  action: 'hover' | 'click' | 'export',
) {
  if (typeof window === 'undefined' || !posthog.__loaded) return;
  posthog.capture('pseo_engage', { surface, action });
}

export function trackCtaImpression(
  ctaId: string,
  placement: 'inflow' | 'sticky' | 'end',
) {
  if (typeof window === 'undefined' || !posthog.__loaded) return;
  posthog.capture('pseo_cta_impression', { cta_id: ctaId, cta_placement: placement });
}

export function trackCtaClick(
  ctaId: string,
  placement: 'inflow' | 'sticky' | 'end',
) {
  if (typeof window === 'undefined' || !posthog.__loaded) return;
  posthog.capture('pseo_cta_click', { cta_id: ctaId, cta_placement: placement });
}

export function trackConversion(
  ctaId: string,
  placement: 'inflow' | 'sticky' | 'end',
  meta?: Record<string, unknown>,
) {
  if (typeof window === 'undefined' || !posthog.__loaded) return;
  posthog.capture('pseo_convert', {
    cta_id: ctaId,
    cta_placement: placement,
    conversion_type: 'newsletter',
    ...(meta ?? {}),
  });
}
