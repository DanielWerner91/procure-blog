import type { MetadataRoute } from 'next';
import { SITE_URL, CATEGORIES } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryUrls,
  ];
}
