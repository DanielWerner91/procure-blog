import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { categoryLabel } from '@/lib/constants';
import type { ProcurementArticle } from '@/lib/types';

export function ArticleContent({ article }: { article: ProcurementArticle }) {
  const date = article.published_at
    ? format(new Date(article.published_at), 'MMMM d, yyyy')
    : '';

  return (
    <article className="mx-auto max-w-[680px]">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        All articles
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
            {categoryLabel(article.category)}
          </span>
          {date && (
            <time className="text-[13px] text-muted-foreground">{date}</time>
          )}
        </div>

        <h1 className="text-[28px] sm:text-[34px] font-bold text-foreground leading-[1.2] tracking-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {article.source_name && (
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-[13px] text-muted-foreground">
              Source:{' '}
              {article.source_url ? (
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline inline-flex items-center gap-1"
                >
                  {article.source_name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-foreground">{article.source_name}</span>
              )}
            </span>
          </div>
        )}
      </header>

      {/* Featured image */}
      {article.featured_image_url && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-10 bg-muted">
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 680px"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs bg-secondary text-muted-foreground rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
