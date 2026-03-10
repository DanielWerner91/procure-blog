import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';
import { categoryLabel } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ProcurementArticle } from '@/lib/types';

export function ArticleCard({
  article,
  featured = false,
}: {
  article: ProcurementArticle;
  featured?: boolean;
}) {
  const date = article.published_at
    ? format(new Date(article.published_at), 'MMM d, yyyy')
    : '';

  if (featured) {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group block rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-[16/10] md:aspect-auto bg-muted overflow-hidden">
            {article.featured_image_url ? (
              <Image
                src={article.featured_image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent/5" />
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="inline-block px-2.5 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
                {categoryLabel(article.category)}
              </span>
              {date && (
                <span className="text-xs text-muted-foreground">{date}</span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight group-hover:text-accent transition-colors duration-200">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            )}
            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-accent">
              Read article
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block rounded-xl overflow-hidden bg-card border border-border/60 hover:border-accent/30 hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        {article.featured_image_url ? (
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/8 to-muted" />
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="inline-block px-2 py-0.5 text-[11px] font-medium bg-accent/10 text-accent rounded-full">
            {categoryLabel(article.category)}
          </span>
          {date && (
            <span className="text-[11px] text-muted-foreground">{date}</span>
          )}
        </div>
        <h2 className="font-semibold text-[15px] text-foreground leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-2">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        )}
        {article.source_name && (
          <p className="mt-3 text-[11px] text-muted-foreground/70 flex items-center gap-1">
            <span className="inline-block w-3 h-px bg-muted-foreground/30" />
            {article.source_name}
          </p>
        )}
      </div>
    </Link>
  );
}
