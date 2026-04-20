import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';
import { PSEO_CATEGORIES, PSEO_CATALOG } from '@/lib/pseo/catalog';
import { listPromotedSlugs } from '@/lib/pseo/status';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Procurement Data Hub',
  description:
    'Live commodity, energy, and metals price data for procurement teams. Sourced from FRED, EIA, IMF, and other public datasets. Updated hourly.',
  alternates: { canonical: `${SITE_URL}/data` },
  robots: { index: true, follow: true },
};

export default async function DataIndexPage() {
  const promoted = await listPromotedSlugs();

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
        IMF, and other public datasets. Updated hourly.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PSEO_CATEGORIES.map((cat) => {
          const entries = PSEO_CATALOG.filter((e) => e.category === cat.slug);
          const promotedCount = entries.filter((e) => promoted.has(e.slug)).length;
          return (
            <Link
              key={cat.slug}
              href={`/data/${cat.slug}`}
              className="rounded-lg border p-5 transition hover:border-foreground/40 hover:bg-muted/30"
            >
              <h2 className="text-lg font-semibold">{cat.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {promotedCount} series
              </p>
            </Link>
          );
        })}
      </div>

      {promoted.size > 0 ? (
        <section className="mt-14">
          <h2 className="text-lg font-semibold">Featured series</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Our most-watched procurement price benchmarks.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {PSEO_CATALOG.filter((e) => promoted.has(e.slug)).map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/data/${e.category}/${e.slug}`}
                  className="flex items-center justify-between rounded border px-3 py-2 text-sm transition hover:border-foreground/40 hover:bg-muted/30"
                >
                  <span className="font-medium">{e.title}</span>
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {e.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
