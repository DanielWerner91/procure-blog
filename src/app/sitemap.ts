import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL, CATEGORIES } from '@/lib/constants';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  const supabase = await createClient();
  const { data: articles } = await supabase
    .from('procurement_articles')
    .select('slug, published_at, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const articleUrls: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: a.updated_at || a.published_at || undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}
