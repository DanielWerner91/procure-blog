import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { secret, slug, category } = body as {
    secret?: string;
    slug?: string;
    category?: string;
  };

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath('/');
  revalidatePath('/feed.xml');
  revalidatePath('/sitemap.xml');

  if (slug) {
    revalidatePath(`/articles/${slug}`);
  }

  if (category) {
    revalidatePath(`/category/${category}`);
  }

  return NextResponse.json({ revalidated: true, slug: slug || null });
}