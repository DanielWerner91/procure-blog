import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { categoryLabel } from '@/lib/constants';
import type { ProcurementArticle } from '@/lib/types';

export function ArticleCard({ article }: { article: ProcurementArticle }) {
  const date = article.published_at
    ? format(new Date(article.published_at), 'MMM d, yyyy')
    : '';

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-accent/40 hover:shadow-md transition-all"
    >
      {article.featured_image_url && (
        <div className="relative aspect-video bg-muted overflow-hidden">
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      {!article.featured_image_url && (
        <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
          <span className="text-4xl opacity-30">&#128230;</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded">
            {categoryLabel(article.category)}
          </span>
          {date && (
            <span className="text-xs text-muted-foreground">{date}</span>
          )}
        </div>
        <h2 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>
        )}
        {article.source_name && (
          <p className="mt-2 text-xs text-muted-foreground">
            Source: {article.source_name}
          </p>
        )}
      </div>
    </Link>
  );
}
