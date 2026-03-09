import { ArticleCard } from './article-card';
import type { ProcurementArticle } from '@/lib/types';

export function ArticleList({ articles }: { articles: ProcurementArticle[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No articles published yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
