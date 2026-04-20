import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import type { CommodityLink } from '@/lib/pseo/commodity-detect';

export function RelatedDataLinks({ links }: { links: CommodityLink[] }) {
  if (!links.length) return null;

  return (
    <aside
      aria-label="Related price data"
      className="mt-10 rounded-xl border border-border/60 bg-muted/30 p-5"
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <BarChart3 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        Related price data
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.slug}>
            <Link
              href={l.url}
              className="flex items-center justify-between rounded border border-border/60 bg-background px-3 py-2 text-sm transition hover:border-accent/40 hover:bg-accent/5"
            >
              <span className="font-medium text-foreground">{l.label}</span>
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {l.category}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
