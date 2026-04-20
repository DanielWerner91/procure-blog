import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/lib/constants';
import {
  PSEO_CATEGORIES,
  getCategory,
  getEntriesByCategory,
  type PseoCategory,
} from '@/lib/pseo/catalog';
import { listPromotedSlugs } from '@/lib/pseo/status';

export const revalidate = 3600;

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return PSEO_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: `${cat.label} Data`,
    description: cat.description,
    alternates: { canonical: `${SITE_URL}/data/${cat.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const entries = getEntriesByCategory(category as PseoCategory);
  const promoted = await listPromotedSlugs();

  const promotedEntries = entries.filter((e) => promoted.has(e.slug));
  const draftEntries = entries.filter((e) => !promoted.has(e.slug));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/data" className="hover:text-foreground">Data</Link>
        <span className="mx-2">/</span>
        <span>{cat.label}</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight">{cat.label} data</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{cat.description}</p>

      {promotedEntries.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Featured</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {promotedEntries.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/data/${e.category}/${e.slug}`}
                  className="flex items-center justify-between rounded border px-3 py-2 text-sm transition hover:border-foreground/40 hover:bg-muted/30"
                >
                  <span className="font-medium">{e.title}</span>
                  <span className="text-xs text-muted-foreground">{e.country || '—'}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {draftEntries.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">Coming soon</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Series we track but haven&apos;t featured yet.
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {draftEntries.map((e) => (
              <li key={e.slug}>
                {/* Draft pages are noindex — nofollow keeps this hub's ranking
                    equity concentrated on the featured (indexable) pages. */}
                <Link
                  href={`/data/${e.category}/${e.slug}`}
                  rel="nofollow"
                  className="flex items-center justify-between rounded border border-dashed px-3 py-2 text-sm text-muted-foreground transition hover:border-foreground/30 hover:bg-muted/20"
                >
                  <span>{e.title}</span>
                  <span className="text-xs">{e.country || '—'}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
