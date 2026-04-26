import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { SITE_URL } from '@/lib/constants';
import { buildTweetText, postTweet } from '@/lib/x';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BATCH_SIZE = 5;

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: articles, error } = await supabase
    .from('procurement_articles')
    .select('id, title, slug, published_at')
    .eq('status', 'published')
    .eq('posted_to_x', false)
    .order('published_at', { ascending: true })
    .limit(BATCH_SIZE);

  if (error) {
    console.error('[cron/post-to-x] Supabase error:', error.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  if (!articles || articles.length === 0) {
    return NextResponse.json({ posted: 0, skipped: 0 });
  }

  const results: Array<{ id: string; status: 'posted' | 'failed'; error?: string }> = [];

  for (const article of articles) {
    const articleUrl = `${SITE_URL}/articles/${article.slug}`;
    const text = buildTweetText(article.title, articleUrl);

    try {
      const tweet = await postTweet(text);

      const { error: updateError } = await supabase
        .from('procurement_articles')
        .update({
          posted_to_x: true,
          posted_to_x_at: new Date().toISOString(),
          x_post_id: tweet.id,
        })
        .eq('id', article.id);

      if (updateError) {
        console.error(
          `[cron/post-to-x] Posted tweet ${tweet.id} but DB update failed for article ${article.id}:`,
          updateError.message,
        );
        results.push({ id: article.id, status: 'failed', error: 'DB update failed after post' });
      } else {
        results.push({ id: article.id, status: 'posted' });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`[cron/post-to-x] Failed to post article ${article.id}:`, message);
      results.push({ id: article.id, status: 'failed', error: message });
    }
  }

  const posted = results.filter((r) => r.status === 'posted').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  return NextResponse.json({ posted, failed, results });
}
