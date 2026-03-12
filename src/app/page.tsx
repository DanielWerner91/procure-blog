import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArticleList } from '@/components/articles/article-list';
import { Marquee } from '@/components/ui/marquee';
import { HeroHeadline } from '@/components/hero-headline';
import { SITE_NAME, SITE_DESCRIPTION, ARTICLES_PER_PAGE, CATEGORIES } from '@/lib/constants';
import type { ProcurementArticle } from '@/lib/types';

export const revalidate = 3600;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10));
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const supabase = await createClient();
  const { data: articles, count } = await supabase
    .from('procurement_articles')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + ARTICLES_PER_PAGE - 1);

  const totalPages = Math.ceil((count || 0) / ARTICLES_PER_PAGE);

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-hero-gradient-from to-hero-gradient-to border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-2xl">
            <HeroHeadline />
            <p className="mt-3 text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              {SITE_DESCRIPTION}
            </p>
            {process.env.NEXT_PUBLIC_BEEHIIV_SUBSCRIBE_URL && (
              <a
                href={process.env.NEXT_PUBLIC_BEEHIIV_SUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
              >
                Subscribe to the newsletter
              </a>
            )}
          </div>
        </div>

        {/* Category marquee */}
        <div className="border-t border-border/40">
          <Marquee speed={40} pauseOnHover className="py-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="mx-3 inline-flex items-center px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground bg-card border border-border/60 rounded-full hover:border-accent/30 transition-colors whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Articles */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <ArticleList
          articles={(articles as ProcurementArticle[]) || []}
          showFeatured={page === 1}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-3 mt-12">
            {page > 1 && (
              <a
                href={`/?page=${page - 1}`}
                className="px-4 py-2 text-[13px] font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Previous
              </a>
            )}
            <span className="px-3 py-2 text-[13px] text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <a
                href={`/?page=${page + 1}`}
                className="px-4 py-2 text-[13px] font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Next
              </a>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
