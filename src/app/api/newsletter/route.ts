import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SITE_URL } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  // H-03 fix: reject when env var is missing or empty
  if (!process.env.NEWSLETTER_API_KEY || apiKey !== process.env.NEWSLETTER_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const since = request.nextUrl.searchParams.get('since');
  if (!since) {
    return NextResponse.json(
      { error: 'Missing "since" query parameter (YYYY-MM-DD)' },
      { status: 400 },
    );
  }

  // H-04 fix: validate since parameter format to prevent DB info leaks
  if (!/^\d{4}-\d{2}-\d{2}$/.test(since)) {
    return NextResponse.json(
      { error: 'Invalid "since" format. Expected YYYY-MM-DD.' },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { data: articles, error } = await supabase
    .from('procurement_articles')
    .select('title, slug, excerpt, published_at, category, featured_image_url')
    .eq('status', 'published')
    .gte('published_at', since)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[newsletter] Supabase error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch articles. Please try again later.' },
      { status: 500 },
    );
  }

  const formatted = (articles || []).map((a) => ({
    title: a.title,
    excerpt: a.excerpt || '',
    link: `${SITE_URL}/articles/${a.slug}`,
    date: a.published_at,
    category: a.category,
    featured_image: a.featured_image_url,
  }));

  return NextResponse.json(formatted);
}