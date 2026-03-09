# AI Procurement News

Public-facing news site for AI in procurement. Replaces the WordPress-based pattern used by AI Insights Hub.

## Architecture

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- **Database:** Supabase (shared project `dtabpbuqodditvhsbpur`)
- **Table:** `procurement_articles` (with RLS — public read for published)
- **Hosting:** Vercel (auto-deploy from GitHub)

## Deployment

- **Repo:** github.com/DanielWerner91/n8n-procurement-news
- **Vercel Project ID:** `prj_yOy4kWk8FwHBMiLQ4UvGjx1VsM43`
- **Live URL:** https://n8n-procurement-news.vercel.app
- **Domain:** TBD (user to configure)

## Key Endpoints

- `/` — Homepage with paginated article grid
- `/articles/[slug]` — Individual article page (SSG + ISR)
- `/category/[category]` — Category-filtered view
- `/feed.xml` — RSS 2.0 feed
- `/sitemap.xml` — Dynamic sitemap
- `/api/revalidate` — POST with `{ secret, slug }` to bust ISR cache (called by n8n)
- `/api/newsletter` — GET with `x-api-key` header and `?since=YYYY-MM-DD` param

## n8n Workflows

| Workflow | ID | Status | Purpose |
|---|---|---|---|
| 01_DANA_Topic Research_Perplexity v2 - AI Procurement | `EsvkJF0Rh05TFdtr` | **Active** | Discovers procurement AI news via Perplexity (6 AM + 6 PM) |
| 02_DANA_Telegram Publish Selector - Procurement | `bgYyiY2edp6PYGTi` | Inactive | Telegram-driven publish flow → `procurement_articles` |
| 04_DANA_Newsletter - Procurement | `ICCuOys8kNThO25i` | Inactive | Reads from `/api/newsletter`, generates digest |

## Categories

procurement_platform, spend_analytics, supplier_management, contract_intelligence, funding, partnership, product_launch, enterprise_adoption, policy, research, other

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `SUPABASE_SERVICE_ROLE_KEY` — Service role for admin operations
- `NEXT_PUBLIC_SITE_URL` — Public site URL
- `REVALIDATION_SECRET` — Shared secret for ISR revalidation webhook
- `NEWSLETTER_API_KEY` — API key for newsletter endpoint
