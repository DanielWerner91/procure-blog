import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ArticleList } from '@/components/articles/article-list';
import { CATEGORIES, categoryLabel, ARTICLES_PER_PAGE } from '@/lib/constants';
import type { ProcurementArticle } from '@/lib/types';

export const revalidate = 3600;

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = categoryLabel(category);
  return {
    title: `${label} — AI Procurement News`,
    description: `Latest AI procurement news in the ${label} category.`,
  };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10));
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const label = categoryLabel(category);

  const supabase = await createClient();
  const { data: articles, count } = await supabase
    .from('procurement_articles')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .range(offset, offset + ARTICLES_PER_PAGE - 1);

  const totalPages = Math.ceil((count || 0) / ARTICLES_PER_PAGE);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">{label}</h1>
        <p className="mt-1 text-muted-foreground">
          AI procurement news in the {label.toLowerCase()} category.
        </p>
      </section>

      <ArticleList articles={(articles as ProcurementArticle[]) || []} />

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-10">
          {page > 1 && (
            <a
              href={`/category/${category}?page=${page - 1}`}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              Previous
            </a>
          )}
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/category/${category}?page=${page + 1}`}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              Next
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
