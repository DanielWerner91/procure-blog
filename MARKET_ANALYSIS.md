# procure.blog — Market Analysis

*Prepared 2026-04-08. Niche: AI-in-procurement news, twice daily, auto-curated via Perplexity + n8n.*

## Target user

Heads of procurement, CPOs, procurement transformation leads, and procurement consultants (Efficio, Deloitte, KPMG, Bain adjacent) who need a 5-minute morning read of what actually shipped in procurement AI. Specifically: the practitioner who is asked "what is Coupa/Zip/SAP doing with AI this week?" in their Monday leadership meeting and wants a single link instead of 15 LinkedIn posts. Secondary: procuretech founders and analyst-relations people who track competitive moves.

## Competitors

1. **Spend Matters** (Hackett Group) — Deep analyst research + daily news. Membership/PRO tier gated; public articles free. Position: the incumbent analyst desk for procuretech. No public consumer pricing; enterprise PRO.
2. **Supply Chain Dive: Procurement** (Industry Dive) — Free daily newsletter, ad-supported, broad supply-chain audience. Position: general-trade daily for supply chain and procurement news. (checked 2026-04-08)
3. **Procurement Magazine / CPOstrategy** (BizClik) — Free online magazine + events, heavy on CPO interviews and vendor features. Position: glossy trade mag for procurement leaders.
4. **CPO Rising / Ardent Partners** — Free blog + paid research reports ($495+ per report typical). Position: analyst blog with premium reports attached.
5. **Art of Procurement / The Sourcing Hero** (Kelly Barner + Una) — Podcast-first, weekly, with "The Sidekick" newsletter. Position: audio-first procurement community.

No direct competitor today is "AI-in-procurement-only, twice daily, machine-curated."

## What we do differently

- **Narrow focus**: only procurement AI, not all of supply chain or all of procuretech.
- **Frequency**: 6 AM + 6 PM auto-research via Perplexity — faster than any trade magazine's weekly cadence.
- **Zero editorial overhead**: n8n + Telegram publish selector means one person can run it.
- **Structured categories** (platform, spend analytics, supplier mgmt, contract intelligence, funding, partnership, product launch, enterprise adoption, policy, research) — more filterable than competitor news walls.
- **Machine-readable**: RSS, sitemap, `/api/newsletter` endpoint — built to be reused by other brands' content pipelines.

## Gaps in our offering

- **No newsletter yet live** — Beehiiv URL is TBD; all competitors lead with email.
- **No author bylines or analyst voice** — Spend Matters and CPO Rising sell themselves on named analysts; procure.blog is anonymous.
- **No vendor comparison / scorecard content** — Spend Matters Vendor Hub is their moat.
- **No events or podcast** — Procurement Magazine and Art of Procurement both monetise live.
- **No tagging of vendors as entities** — can't currently do "all news about Zip" or "all news about Coupa."
- **No data visualisations** (funding tracker, deal tracker) — CB Insights / PitchBook do this for procuretech and charge heavily.
- **Telegram publish selector is inactive** — publishing loop is not actually closed end to end.

## Positioning recommendation

*"The twice-daily AI procurement briefing — every product launch, funding round, and enterprise deployment, in five minutes before your stand-up."*

## Monetization recommendation

- **Free tier (now)**: full site + RSS + newsletter. Build the list first, it is worth more than CPM ads at this scale.
- **Sponsored slot** ($500-1500/week per issue): one vendor logo + 40-word blurb in the newsletter. Benchmark: Supply Chain Dive sells sponsored posts in the mid-four figures.
- **Pro tier** ($29/month or $290/year): vendor-tagged feeds, weekly funding tracker, searchable archive, CSV export. Undercuts Spend Matters PRO (enterprise-priced) and matches the practitioner's personal card budget.
- **Custom research** ($1-5k one-off): a "brief me on vendor X" report generated on the existing Perplexity + Claude stack.

## 3 quick wins

1. **Ship the Beehiiv newsletter**. Set `NEXT_PUBLIC_BEEHIIV_SUBSCRIBE_URL`, flip on the existing inactive workflow `ICCuOys8kNThO25i`. This is the single largest gap — every competitor leads with email and procure.blog currently has no capture.
2. **Add a vendor tag to `procurement_articles`** and a `/vendor/[slug]` page. Claude can backfill vendor tags from existing article bodies in one batch. Unlocks "all Coupa news", "all Zip news" — the thing Spend Matters charges for.
3. **Add a weekly "Funding & Deals" auto-digest page** filtered by the `funding` + `partnership` categories that already exist. One SQL query, one page, zero new infra. CB Insights sells this angle for thousands.

## 3 big bets

1. **Vendor scorecard / comparison hub**: for the top 30 procuretech vendors, a live page that aggregates every article, funding round, and product launch, plus an LLM-generated "what changed this quarter" summary refreshed weekly. This is a direct shot at Spend Matters Vendor Hub at 1/100th the cost.
2. **"Deployed in the wild" database**: a structured table of every named enterprise AI procurement deployment (Nordstrom/Manifest, Unilever/Zip, etc.) extracted from articles. Becomes the canonical "who is actually using this" dataset procurement buyers beg for. Monetise as a Pro feature and as data licensing to vendors.
3. **Procurement AI practitioner community** (gated Slack or Circle) bundled with the Pro tier. Art of Procurement owns audio; nobody owns the async practitioner chat. Daniel's Efficio + OpenAI partnership positioning is the organic lead-in.

## Sources

- https://www.spendmatters.com/
- https://www.supplychaindive.com/signup/procurement/
- https://procurementmag.com/
- https://cporising.com/
- https://artofprocurement.com/blog/the-sourcing-hero-podcast-hits-10000-downloads
- https://una.com/the-sourcing-hero-podcast/
