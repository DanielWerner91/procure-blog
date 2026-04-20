import { createClient } from '@supabase/supabase-js';

export type PseoStatus = 'draft' | 'promoted' | 'killed';

export interface PseoPageRow {
  slug: string;
  brand: string;
  category: string;
  index_id: string;
  status: PseoStatus;
  promoted_at: string | null;
}

// Cookie-free anon client so the pSEO template can be statically prerendered
// with ISR. Reads only public `pseo_pages` rows (public-read RLS policy).
let cached: ReturnType<typeof createClient> | null = null;
function anonClient() {
  if (!cached) {
    cached = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
  }
  return cached;
}

export async function getPseoStatus(slug: string): Promise<PseoPageRow | null> {
  const { data, error } = await anonClient()
    .from('pseo_pages')
    .select('slug, brand, category, index_id, status, promoted_at')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as PseoPageRow;
}

// Returns the slugs that should be prerendered. Excludes killed pages.
// Returns null if Supabase is unreachable so the build can fall back to the
// full catalog rather than skipping every page.
export async function listActiveSlugs(): Promise<string[] | null> {
  const { data, error } = await anonClient()
    .from('pseo_pages')
    .select('slug')
    .eq('brand', 'procure-blog')
    .in('status', ['draft', 'promoted']);
  if (error || !data) return null;
  return (data as Array<{ slug: string }>).map((r) => r.slug);
}
