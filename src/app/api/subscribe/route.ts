import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { classifyTraffic } from '@/lib/pseo/analytics';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CF_BASE = process.env.NEWSLETTER_PLATFORM_URL || 'https://content-flywheel.com';

export async function POST(request: NextRequest) {
  let body: { email?: unknown; source?: unknown; pseo?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' ? body.source.slice(0, 64) : 'procure-blog';

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const referrer = request.headers.get('referer')?.slice(0, 500) ?? 'https://procure.blog';
  const refUrl = safeUrl(referrer);
  const utmSource = refUrl?.searchParams.get('utm_source') ?? null;

  const pseoMeta = parsePseoMeta(body.pseo);
  const pseoSlug = pseoMeta?.slug ?? (source.startsWith('pseo_') ? source.slice(5) : null);

  try {
    const res = await fetch(`${CF_BASE}/api/subscribe?brand=procure-blog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source,
        utm_source: utmSource,
        utm_medium: pseoMeta ? 'pseo' : 'inline_cta',
        utm_campaign: 'procure_blog',
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[subscribe] CF newsletter error:', res.status, text);
      return NextResponse.json(
        { error: 'Could not subscribe right now. Please try again later.' },
        { status: 502 },
      );
    }

    if (pseoSlug) {
      await logPseoConversion({
        slug: pseoSlug,
        email,
        cta_placement: pseoMeta?.cta_placement ?? 'inflow',
        referrer,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[subscribe] fetch failed:', err);
    return NextResponse.json(
      { error: 'Could not subscribe right now. Please try again later.' },
      { status: 502 },
    );
  }
}

function parsePseoMeta(
  raw: unknown,
): { slug: string; cta_placement: 'inflow' | 'sticky' | 'end' } | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const slug = typeof obj.slug === 'string' ? obj.slug.slice(0, 128) : null;
  if (!slug) return null;
  const placement = obj.cta_placement;
  const placementValue =
    placement === 'sticky' || placement === 'end' || placement === 'inflow'
      ? placement
      : 'inflow';
  return { slug, cta_placement: placementValue };
}

async function logPseoConversion(params: {
  slug: string;
  email: string;
  cta_placement: 'inflow' | 'sticky' | 'end';
  referrer: string;
}) {
  try {
    const supabase = createAdminClient();
    const refUrl = safeUrl(params.referrer);
    const utmSource = refUrl?.searchParams.get('utm_source') ?? null;
    const { channel, ai_source } = classifyTraffic(params.referrer, utmSource);
    await supabase.from('pseo_conversions').insert({
      slug: params.slug,
      email: params.email,
      cta_placement: params.cta_placement,
      referrer: params.referrer,
      traffic_channel: channel,
      ai_source,
      utm_source: utmSource,
    });
  } catch (err) {
    console.error('[subscribe] pseo conversion log failed:', err);
  }
}

function safeUrl(input: string): URL | null {
  try {
    return new URL(input);
  } catch {
    return null;
  }
}
