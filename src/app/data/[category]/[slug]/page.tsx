import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import {
  getCategory,
  getEntryBySlug,
  PSEO_CATALOG,
  type PseoEntry,
} from '@/lib/pseo/catalog';
import { fetchIndexData, type IndexData } from '@/lib/pseo/index-fetch';
import { buildContext } from '@/lib/pseo/context';
import { sourceLabel, sourceUrl } from '@/lib/pseo/source-meta';
import { buildDatasetJsonLd, buildBreadcrumbJsonLd } from '@/lib/pseo/json-ld';
import { getPseoStatus, listActiveSlugs } from '@/lib/pseo/status';
import { PseoTracker } from '@/components/pseo/tracker';
import { InlineChart } from '@/components/pseo/inline-chart';
import { DataTable } from '@/components/pseo/data-table';
import { NewsletterCta } from '@/components/pseo/newsletter-cta';
import { StickyCtaGate } from '@/components/pseo/sticky-cta-gate';

export const revalidate = 3600;

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const active = await listActiveSlugs();
  const allowed = active ? new Set(active) : null;
  const entries = allowed
    ? PSEO_CATALOG.filter((e) => allowed.has(e.slug))
    : PSEO_CATALOG;
  return entries.map((e) => ({ category: e.category, slug: e.slug }));
}

function latestValueFmt(data: IndexData): string | null {
  if (data.latest.value === null) return null;
  const v = data.latest.value;
  const trimmed = Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2);
  return `${trimmed} ${data.definition.unit}`;
}

function latestMonthFmt(data: IndexData): string | null {
  if (!data.latest.date) return null;
  try {
    return new Date(data.latest.date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return data.latest.date;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const entry = getEntryBySlug(slug);
  const cat = getCategory(category);
  if (!entry || !cat || entry.category !== category) return {};

  const status = await getPseoStatus(slug);
  const shouldIndex = status?.status === 'promoted';

  const data = await fetchIndexData(entry.indexId);
  const valueFmt = data ? latestValueFmt(data) : null;
  const monthFmt = data ? latestMonthFmt(data) : null;

  const suffix = valueFmt && monthFmt ? `${valueFmt}, ${monthFmt}` : 'latest price & history';
  const title = `${entry.title}: ${suffix}`;
  const description = data
    ? `${entry.h1} latest reading${valueFmt ? ` ${valueFmt}` : ''}${monthFmt ? ` (${monthFmt})` : ''}. Historical chart, data table, and source citations for procurement teams.`
    : `${entry.h1} price history, data table, and source citations for procurement teams.`;

  const url = `${SITE_URL}/data/${entry.category}/${entry.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: SITE_NAME,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: valueFmt ? `${valueFmt} — ${entry.h1}` : title,
      description,
    },
  };
}

function siblingLinks(entry: PseoEntry, limit: number) {
  const cat = PSEO_CATALOG.filter((e) => e.category === entry.category && e.slug !== entry.slug);
  const sameRegion = cat.filter((e) => e.region === entry.region);
  const rest = cat.filter((e) => e.region !== entry.region);
  return [...sameRegion, ...rest].slice(0, limit);
}

export default async function PseoPage({ params }: Props) {
  const { category, slug } = await params;
  const entry = getEntryBySlug(slug);
  const cat = getCategory(category);
  if (!entry || !cat || entry.category !== category) notFound();

  const status = await getPseoStatus(entry.slug);
  if (status?.status === 'killed') notFound();

  const data = await fetchIndexData(entry.indexId);
  if (!data || data.observations.length === 0) notFound();

  const context = buildContext(entry, data);
  const datasetJsonLd = buildDatasetJsonLd(entry, data);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(entry, cat.label);
  const siblings = siblingLinks(entry, 5);
  const valueFmt = latestValueFmt(data);
  const monthFmt = latestMonthFmt(data);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PseoTracker
        slug={entry.slug}
        category={entry.category}
        indexId={entry.indexId}
        country={entry.country}
        region={entry.region}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/data" className="hover:text-foreground">Data</Link>
        <span className="mx-2">/</span>
        <Link href={`/data/${entry.category}`} className="hover:text-foreground">
          {cat.label}
        </Link>
        <span className="mx-2">/</span>
        <span>{entry.title}</span>
      </nav>

      <header>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{entry.h1}</h1>
        {valueFmt && monthFmt ? (
          <p className="mt-3 text-lg text-muted-foreground">
            Latest reading: <span className="font-medium text-foreground">{valueFmt}</span>{' '}
            ({monthFmt})
          </p>
        ) : null}

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">1-month change</dt>
            <dd className="mt-1 font-medium">{fmtPct(data.change1m)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">3-month change</dt>
            <dd className="mt-1 font-medium">{fmtPct(data.change3m)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">12-month change</dt>
            <dd className="mt-1 font-medium">{fmtPct(data.change12m)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Source</dt>
            <dd className="mt-1 font-medium">
              {sourceUrl(data.definition) ? (
                <a
                  href={sourceUrl(data.definition)}
                  className="underline underline-offset-2 hover:text-foreground"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {data.definition.source}
                </a>
              ) : (
                data.definition.source
              )}{' '}
              <span className="font-mono text-xs text-muted-foreground">
                {data.definition.seriesId}
              </span>
            </dd>
          </div>
        </dl>
      </header>

      <section aria-label="Price history chart" className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Price history</h2>
        <InlineChart
          observations={data.observations}
          unit={data.definition.unit}
          title={entry.title}
        />
      </section>

      <section aria-label="Observations table" className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Observations</h2>
        <DataTable
          observations={data.observations}
          unit={data.definition.unit}
          sourceLabel={sourceLabel(data.definition)}
          sourceUrl={sourceUrl(data.definition)}
        />
      </section>

      <section aria-label="Analysis" className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">What the data shows</h2>
        <p className="text-base leading-relaxed text-foreground/90">{context}</p>
      </section>

      <NewsletterCta placement="inflow" slug={entry.slug} label={entry.h1} category={entry.category} />

      <section aria-label="Related series" className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Related series</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {siblings.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/data/${s.category}/${s.slug}`}
                className="flex items-center justify-between rounded border px-3 py-2 text-sm transition hover:border-foreground/40 hover:bg-muted/30"
              >
                <span>{s.title}</span>
                <span className="text-xs text-muted-foreground">{s.country || '—'}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <StickyCtaGate slug={entry.slug} label={entry.h1} category={entry.category} />
    </article>
  );
}

function fmtPct(v: number | null): string {
  if (v === null) return '—';
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
}
