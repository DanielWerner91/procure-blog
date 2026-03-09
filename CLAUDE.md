# AI Procurement News

Public-facing news site for AI in procurement. Replaces the WordPress-based pattern used by AI Insights Hub.

## Architecture

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- **Database:** Supabase (shared project `dtabpbuqodditvhsbpur`)
- **Table:** `procurement_articles` (with RLS — public read for published)
- **Hosting:** Vercel (auto-deploy from GitHub)

## Key Endpoints

- `/` — Homepage with paginated article grid
- `/articles/[slug]` — Individual article page (SSG + ISR)
- `/category/[category]` — Category-filtered view
- `/feed.xml` — RSS 2.0 feed
- `/sitemap.xml` — Dynamic sitemap
- `/api/revalidate` — POST with `{ secret, slug }` to bust ISR cache (called by n8n)
- `/api/newsletter` — GET with `x-api-key` header and `?since=YYYY-MM-DD` param

## n8n Integration

- **Perplexity workflow** (`EsvkJF0Rh05TFdtr`) discovers procurement news → `content_trends` table
- **Telegram Publish Selector** creates articles in `procurement_articles` and calls `/api/revalidate`
- **Newsletter workflow** reads from `/api/newsletter`

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `SUPABASE_SERVICE_ROLE_KEY` — Service role for admin operations
- `NEXT_PUBLIC_SITE_URL` — Public site URL
- `REVALIDATION_SECRET` — Shared secret for ISR revalidation webhook
- `NEWSLETTER_API_KEY` — API key for newsletter endpoint
