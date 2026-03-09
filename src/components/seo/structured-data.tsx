import { SITE_NAME, SITE_URL } from '@/lib/constants';
import type { ProcurementArticle } from '@/lib/types';

export function ArticleStructuredData({
  article,
}: {
  article: ProcurementArticle;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.meta_description || article.excerpt || '',
    image: article.featured_image_url || undefined,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    url: `${SITE_URL}/articles/${article.slug}`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articles/${article.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
