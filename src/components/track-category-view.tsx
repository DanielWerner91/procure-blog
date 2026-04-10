'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

interface TrackCategoryViewProps {
  category: string;
}

export function TrackCategoryView({ category }: TrackCategoryViewProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture('category_viewed', { category });
    }
  }, [posthog, category]);

  return null;
}
