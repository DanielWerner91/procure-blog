import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ArticleList } from '@/components/articles/article-list';
import { CATEGORIES, categoryLabel, ARTICLES_PER_PAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
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
    title: label,
    description: `Latest AI procurement news in the ${label} category.`,
  };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
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
    <div>
      {/* Category header */}
      <section className="bg-gradient-to-b from-hero-gradient-from to-hero-gradient-to border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
          <p className="text-xs font-medium uppercase tracking-wider text-accent mb-2">Category</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{label}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            AI procurement news in the {label.toLowerCase()} category.
          </p>
        </div>

        {/* Category pills */}
        <div className="border-t border-border/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
            <Link
              href="/"
              className="inline-flex items-center px-3 py-1 text-xs font-medium text-muted-foreground bg-card border border-border/60 rounded-full hover:border-accent/30 transition-colors whitespace-nowrap"
            >
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={cn(
                  'inline-flex items-center px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors',
                  cat.slug === category
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground bg-card border border-border/60 hover:border-accent/30'
                )}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <ArticleList articles={(articles as ProcurementArticle[]) || []} />

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-3 mt-12">
            {page > 1 && (
              <Link
                href={`/category/${category}?page=${page - 1}`}
                className="px-4 py-2 text-[13px] font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Previous
              </Link>
            )}
            <span className="px-3 py-2 text-[13px] text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/category/${category}?page=${page + 1}`}
                className="px-4 py-2 text-[13px] font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Next
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}