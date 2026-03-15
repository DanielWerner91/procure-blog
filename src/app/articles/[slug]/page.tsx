import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { SITE_NAME, SITE_URL, categoryLabel } from '@/lib/constants';
import type { ProcurementArticle } from '@/lib/types';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('procurement_articles')
    .select('slug')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(100);

  return (data ?? []).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from('procurement_articles')
    .select('title, excerpt, meta_description, featured_image_url, category')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) return {};

  const description = article.meta_description || article.excerpt || '';

  return {
    title: article.title,
    description,
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      siteName: SITE_NAME,
      url: `${SITE_URL}/articles/${slug}`,
      ...(article.featured_image_url && {
        images: [{ url: article.featured_image_url }],
      }),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from('procurement_articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) notFound();

  const a = article as ProcurementArticle;
  const date = a.published_at
    ? format(new Date(a.published_at), 'MMMM d, yyyy')
    : null;

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-b from-hero-gradient-from to-hero-gradient-to border-b border-border/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to articles
          </Link>

          <div className="flex items-center gap-2.5 mb-3">
            <Link
              href={`/category/${a.category}`}
              className="inline-block px-2.5 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors"
            >
              {categoryLabel(a.category)}
            </Link>
            {date && (
              <span className="text-xs text-muted-foreground">{date}</span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
            {a.title}
          </h1>

          {a.excerpt && (
            <p className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              {a.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Featured image */}
      {a.featured_image_url && (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 -mt-1">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted border border-border/40">
            <Image
              src={a.featured_image_url}
              alt={a.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        </div>
      )}

      {/* Article content */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: a.content }}
        />

        {/* Source attribution */}
        {a.source_url && (
          <div className="mt-10 pt-6 border-t border-border/40">
            <a
              href={a.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Read original at {a.source_name || 'source'}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {/* Tags */}
        {a.tags && a.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {a.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] font-medium text-muted-foreground bg-muted rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
