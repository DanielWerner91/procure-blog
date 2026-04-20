import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  PSEO_CATEGORIES,
  getCategory,
  getEntriesByCategory,
  type PseoCategory,
} from '@/lib/pseo/catalog';

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
    robots: { index: false, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const entries = getEntriesByCategory(category as PseoCategory);
  const byRegion: Record<string, typeof entries> = {};
  for (const e of entries) {
    if (!byRegion[e.region]) byRegion[e.region] = [];
    byRegion[e.region].push(e);
  }

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

      <div className="mt-10 space-y-10">
        {Object.entries(byRegion).map(([region, list]) => (
          <section key={region}>
            <h2 className="text-lg font-semibold">{region}</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {list.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/data/${e.category}/${e.slug}`}
                    className="flex items-center justify-between rounded border px-3 py-2 text-sm transition hover:border-foreground/40 hover:bg-muted/30"
                  >
                    <span>{e.title}</span>
                    <span className="text-xs text-muted-foreground">{e.country || '—'}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
