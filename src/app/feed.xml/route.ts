import { createClient } from '@/lib/supabase/server';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';

export const revalidate = 3600;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from('procurement_articles')
    .select('title, slug, excerpt, published_at, category, source_url')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50);

  const items = (articles || [])
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${a.source_url ? escapeXml(a.source_url) : `${SITE_URL}`}</link>
      <guid isPermaLink="false">${a.slug}</guid>
      <description>${escapeXml(a.excerpt || '')}</description>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      <category>${escapeXml(a.category)}</category>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
