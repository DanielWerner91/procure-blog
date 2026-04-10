'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

interface TrackArticleViewProps {
  slug: string;
  category: string;
}

export function TrackArticleView({ slug, category }: TrackArticleViewProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture('article_viewed', { slug, category });
    }
  }, [posthog, slug, category]);

  return null;
}
