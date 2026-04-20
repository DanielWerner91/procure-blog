// Server-side fetcher for procure-index data. procure-index is the data service,
// procure.blog is the SEO/content surface. Called from the page template during
// SSR/ISR rendering.

export interface IndexDefinition {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  region: string;
  country: string;
  source: string;
  seriesId: string;
  unit: string;
  frequency: 'D' | 'W' | 'M' | 'Q' | 'A';
}

export interface IndexObservation {
  date: string;
  value: number;
}

export interface IndexData {
  definition: IndexDefinition;
  latest: { value: number | null; date: string | null };
  change1m: number | null;
  change3m: number | null;
  change12m: number | null;
  observations: IndexObservation[];
}

const PROCURE_INDEX_URL =
  process.env.PROCURE_INDEX_API_URL ?? 'https://index.procure.blog';

async function fetchOnce(id: string, opts: RequestInit & { next?: { revalidate?: number } }): Promise<IndexData | null> {
  try {
    const res = await fetch(`${PROCURE_INDEX_URL}/api/indices/${id}`, opts);
    if (!res.ok) return null;
    return (await res.json()) as IndexData;
  } catch {
    return null;
  }
}

// Fetches with cache, and if the cached/upstream response is empty (upstream
// cold-cache race during deploy), retries once with cache-bust + no-store to
// force fresh data. Prevents the "prerender-as-404" trap we hit on Brent/WTI/
// Henry Hub when procure-index's in-memory cache returned 0 obs transiently.
export async function fetchIndexData(id: string): Promise<IndexData | null> {
  const cached = await fetchOnce(id, { next: { revalidate: 3600 } });
  if (cached && cached.observations && cached.observations.length > 0) {
    return cached;
  }
  // Retry with cache-bust — bypasses both our fetch cache and procure-index's
  // in-memory cache (the ?cb param forces a new Vercel cache key).
  const fresh = await fetchOnce(`${id}?cb=${Date.now()}`, { cache: 'no-store' });
  return fresh && fresh.observations && fresh.observations.length > 0 ? fresh : null;
}
