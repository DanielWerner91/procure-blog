import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ArticleContent } from '@/components/articles/article-content';
import { ArticleStructuredData } from '@/components/seo/structured-data';
import { SITE_URL } from '@/lib/constants';
import type { ProcurementArticle } from '@/lib/types';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string): Promise<ProcurementArticle | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('procurement_articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data as ProcurementArticle | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.meta_description || article.excerpt || '',
    openGraph: {
      title: article.title,
      description: article.meta_description || article.excerpt || '',
      type: 'article',
      publishedTime: article.published_at || undefined,
      url: `${SITE_URL}/articles/${article.slug}`,
      images: article.featured_image_url
        ? [{ url: article.featured_image_url }]
        : [],
    },
  };
}

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('procurement_articles')
    .select('slug')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50);

  return (data || []).map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <ArticleStructuredData article={article} />
      <ArticleContent article={article} />
    </div>
  );
}
