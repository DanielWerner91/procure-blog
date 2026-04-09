import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BRAND_SLUG = 'procure-blog';

export async function POST(request: NextRequest) {
  let body: { email?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' ? body.source.slice(0, 64) : null;

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const referrer = request.headers.get('referer')?.slice(0, 500) ?? null;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('newsletter_waitlist')
    .insert({ email, brand_slug: BRAND_SLUG, source, referrer });

  if (error) {
    // Unique violation = already on the list. Treat as success.
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, already: true });
    }
    console.error('[waitlist] insert error:', error.message);
    return NextResponse.json({ error: 'Could not join the waitlist right now. Please try again later.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
