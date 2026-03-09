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
    <article className="mx-auto max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all articles
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded">
            {categoryLabel(article.category)}
          </span>
          {date && (
            <time className="text-sm text-muted-foreground">{date}</time>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          {article.source_name && (
            <span>
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
                article.source_name
              )}
            </span>
          )}
        </div>
      </header>

      {article.featured_image_url && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8 bg-muted">
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <div
        className="article-content text-foreground"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs bg-muted text-muted-foreground rounded-full"
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
