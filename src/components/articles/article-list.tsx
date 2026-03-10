import { ArticleCard } from './article-card';
import type { ProcurementArticle } from '@/lib/types';

export function ArticleList({
  articles,
  showFeatured = false,
}: {
  articles: ProcurementArticle[];
  showFeatured?: boolean;
}) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-sm">No articles published yet.</p>
      </div>
    );
  }

  const featured = showFeatured ? articles[0] : null;
  const rest = showFeatured ? articles.slice(1) : articles;

  return (
    <div className="space-y-8">
      {/* Featured article */}
      {featured && (
        <ArticleCard article={featured} featured />
      )}

      {/* Article grid */}
      {rest.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
