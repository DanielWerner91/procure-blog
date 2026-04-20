import type { Metadata } from 'next';
import Link from 'next/link';
import { PSEO_CATEGORIES, PSEO_CATALOG } from '@/lib/pseo/catalog';

export const metadata: Metadata = {
  title: 'Procurement Data Hub',
  description:
    'Live commodity, energy, and procurement price data sourced from FRED, EIA, IMF, and other public datasets.',
  robots: { index: false, follow: true },
};

export default function DataIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <span>Data</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight">Procurement data hub</h1>
      <p className="mt-3 text-muted-foreground">
        Live price and index data for procurement teams. Sourced from FRED, EIA,
        IMF, and other public datasets. Updated hourly with an in-memory cache.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PSEO_CATEGORIES.map((cat) => {
          const count = PSEO_CATALOG.filter((e) => e.category === cat.slug).length;
          return (
            <Link
              key={cat.slug}
              href={`/data/${cat.slug}`}
              className="rounded-lg border p-5 transition hover:border-foreground/40 hover:bg-muted/30"
            >
              <h2 className="text-lg font-semibold">{cat.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {count} series
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
