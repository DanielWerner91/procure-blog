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

export async function fetchIndexData(id: string): Promise<IndexData | null> {
  try {
    const res = await fetch(`${PROCURE_INDEX_URL}/api/indices/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as IndexData;
  } catch {
    return null;
  }
}
