---
name: carousel-generator
description: "Generate branded news carousels and cards for LinkedIn and Instagram. Template-based pipeline: Claude structures slides → Satori renders pixel-perfect PNGs with brand colors. Actions: create, generate, build carousel, news card. Triggers: create carousel, generate carousel, make a carousel about, news carousel, LinkedIn carousel, Instagram carousel, create news card, generate card."
---

# Carousel Generator — Branded News Carousel & Card Pipeline

Generates publication-ready news carousels (multi-slide) and single news cards for LinkedIn and Instagram using a deterministic template-based pipeline: Claude structures the slide content → Satori (JSX→SVG) + resvg (SVG→PNG) renders pixel-perfect images with brand-consistent styling. Every image inherits the brand's design system automatically.

## When This Skill Activates

Use when the user requests any of:
- Creating a news carousel (any topic)
- Generating a LinkedIn or Instagram carousel
- Creating a single news card image
- Building branded slide decks for social media
- Any carousel/card request flowing through the Content Flywheel

## Key Difference from Infographic Generator

| | Carousel Generator | Infographic Generator |
|---|---|---|
| **Rendering** | Satori templates (deterministic, pixel-perfect) | Nano Banana / AI image generation |
| **Output** | Multiple 1080×1080 PNGs (one per slide) | Single 1080×1350 PNG |
| **Visual consistency** | 100% — same code = same pixels every time | Variable — AI generates each image differently |
| **Best for** | News breakdowns, educational content, story arcs | Data visualizations, statistics, comparisons |

---

## Pipeline Overview

```
[1. CONTEXT] → [2. RESEARCH] → [3. STRUCTURE] → [4. RENDER] → [5. DELIVER]
```

---

## Phase 1: Context Gathering

1. **Identify the brand** — which Content Flywheel brand is this for?
   - Load brand data from Supabase: `GET /api/brands/[slug]`
   - Key fields: `design_system.colors` (primary, secondary, accent, background, text), `logo_url`, `name`

2. **Extract brand colors** for the templates:
   ```
   brandColors = {
     background: design_system.colors.background,  // e.g. '#0a0a0a'
     primary: design_system.colors.primary,          // e.g. '#0000fe'
     text: design_system.colors.text,                // e.g. '#f5f5f5'
     secondary: design_system.colors.secondary,      // e.g. '#1a1a1a'
   }
   ```

3. **Get the brand logo** — `brand.logo_url` (Supabase Storage URL). Will be converted to base64 for Satori embedding.

**Output:** Brand colors + logo URL ready.

---

## Phase 2: Topic Research

For every carousel, ensure content accuracy:

1. **Use WebSearch** to find current, accurate information on the topic
2. **Verify all statistics and claims** — every number must be real and attributable
3. **Identify the story arc** — what's the narrative from slide 1 to the final slide?
4. **Note the source** for attribution on the news card and cover slide
5. **Find the source URL** — needed to extract og:image for the hero image on the cover slide

**Output:** Verified facts, statistics, quotes, and source URL.

---

## Phase 3: Structure the Slides

Build the slide data following the **fixed slide pattern** for visual consistency.

### Carousel Structure (5-7 slides)

Every carousel MUST follow this exact pattern:

| Slide | Type | Purpose | Content Rules |
|-------|------|---------|---------------|
| 1 | `cover` | Hook — stop the scroll | Bold headline (max 10 words), hero image from source URL |
| 2 | `stat` | Big number — create impact | One impressive statistic, giant number, short label |
| 3 | `point` | Key insight #1 | Numbered circle, bold headline, 1-2 sentence body |
| 4 | `point` or `quote` | Key insight #2 or expert voice | Same format as point, OR a compelling quote with attribution |
| 5 | `point` or `stat` | Key insight #3 or second stat | Continue the story |
| 6 | `quote` (optional) | Social proof or expert take | Big quote mark, attribution line |
| Last | `cta` | Call to action | Brand name + logo, "Follow for daily [topic] insights" |

### Content Rules Per Slide

- **25-50 words maximum per slide** — ONE key idea only
- **Headlines**: Max 8 words, punchy, no fluff
- **Body text**: 1-2 sentences max, supporting the headline
- **Stats**: Use the actual number (e.g., "68%", "3x", "$4.2B"), not words
- **Quotes**: Max 20 words, must be attributed

### Slide Data Format

```typescript
const slides = [
  { type: 'cover', headline: '...', heroImageUrl: null, slideNumber: 1, totalSlides: 6 },
  { type: 'stat', headline: '...', stat: '68%', statLabel: 'of developers surveyed', slideNumber: 2, totalSlides: 6 },
  { type: 'point', headline: '...', body: '...', slideNumber: 3, totalSlides: 6 },
  { type: 'point', headline: '...', body: '...', slideNumber: 4, totalSlides: 6 },
  { type: 'quote', headline: '...', quote: '...', quoteAttribution: 'Name, Source', slideNumber: 5, totalSlides: 6 },
  { type: 'cta', headline: '', ctaText: 'Follow for daily AI insights' },
];
```

### Also Generate a News Card

For every carousel, also create a matching single news card:
```typescript
const cardData = {
  headline: '...',        // Full news headline (can be longer than carousel cover)
  category: 'AI & TECH',  // Short category label, ALL CAPS
  heroImageUrl: null,      // Will be populated from og:image
  companyLogoUrl: null,    // Clearbit logo of the source company
  sourceAttribution: 'TechCrunch',  // Source name
  brandName: 'AI Insights Hub',
  brandColors,
};
```

**Output:** Structured slide array + card data.

---

## Phase 4: Render the Images

Create a test script in the project directory and run it with `npx tsx`.

### Render Script Template

```typescript
import { buildNewsCard } from './src/lib/image-templates/news-card';
import { buildAllCarouselSlides } from './src/lib/image-templates/news-carousel';
import { renderToPng, renderSlides } from './src/lib/image-templates/renderer';
import { imageToBase64 } from './src/lib/image-templates/assets';
import { writeFileSync } from 'fs';

async function main() {
  const logoUrl = '[BRAND_LOGO_URL]';
  const brandColors = { background: '[BG]', primary: '[PRIMARY]', text: '[TEXT]', secondary: '[SECONDARY]' };
  const logoBase64 = await imageToBase64(logoUrl);

  // Render news card
  const cardPng = await renderToPng({ width: 1080, height: 1080, jsx: buildNewsCard({
    headline: '[HEADLINE]',
    category: '[CATEGORY]',
    heroImageUrl: null,
    companyLogoUrl: null,
    brandLogoUrl: logoBase64,
    sourceAttribution: '[SOURCE]',
    brandName: '[BRAND_NAME]',
    brandColors,
  })});
  writeFileSync('/tmp/carousel-card.png', cardPng);

  // Render carousel slides
  const slides = [/* structured slides from Phase 3 */];
  const jsxSlides = buildAllCarouselSlides({
    brandName: '[BRAND_NAME]',
    brandLogoUrl: logoBase64,
    brandColors,
    slides,
  });
  const pngSlides = await renderSlides(jsxSlides, 1080, 1080);
  pngSlides.forEach((png: Buffer, i: number) =>
    writeFileSync('/tmp/carousel-slide-' + i + '.png', png)
  );

  console.log('Done: 1 card + ' + pngSlides.length + ' slides');
}

main().catch(e => { console.error(e); process.exit(1); });
```

### CRITICAL: Render Script Rules

1. **Save the script IN the project directory** (e.g., `content-flywheel/render-carousel.ts`) — relative imports like `./src/lib/...` won't resolve from `/tmp`
2. **Run with**: `cd ~/n8n-apps/content-flywheel && npx tsx render-carousel.ts`
3. **Clean up** the script file after rendering: `rm render-carousel.ts`
4. **Output PNGs go to `/tmp/`** for easy preview

**Output:** PNG files on disk.

---

## Phase 5: Deliver & Review

1. **Open all images** for user review:
   ```bash
   open /tmp/carousel-card.png /tmp/carousel-slide-0.png /tmp/carousel-slide-1.png ...
   ```

2. **If generating through the Content Flywheel pipeline** (not ad-hoc):
   - The render pipeline at `src/lib/image-templates/render-pipeline.ts` handles:
     - Asset fetching (og:image, Clearbit logos, brand logo)
     - Template building with brand colors
     - PNG rendering via Satori + resvg
     - The API route uploads to Supabase Storage

3. **If generating ad-hoc** (user asks directly):
   - Render locally as above
   - Open for review
   - User can manually upload to their preferred platform

---

## Brand Guidelines Enforcement

Every carousel and card MUST use:
- **Exact hex colors** from `design_system.colors` — no approximations
- **Brand logo** from `logo_url` — converted to base64, shown in bottom-right brand mark
- **Brand name** — in the brand mark next to the logo
- **Consistent visual elements**: geometric grid background, gradient top bar, accent underlines, dot slide indicators

### Template Visual Language (Locked)

These elements are hardcoded in the JSX templates and render identically every time:

| Element | Specification |
|---------|--------------|
| Grid background | 60px squares, `{accent}08` opacity |
| Top gradient bar | 5px height, `accent → secondary` gradient |
| Corner glow | 500px radial gradient, `{accent}10` opacity, top-right |
| Accent underline | 80px wide, 4px tall, `accent` color |
| Brand mark | Bottom-right: logo (28px) + brand name (20px, bold, accent color) |
| Slide indicators | Dots: 8px inactive (#334155), 32px×8px active (accent color) |
| Padding | 64px sides, 44-56px top/bottom |
| Font | Inter (400 regular, 700 bold) |
| Cover headline | 68px (no hero) or 56px (with hero), bold, -0.02em tracking |
| Stat number | 160px, bold, accent color, -0.04em tracking |
| Point headline | 52px, bold, text color |
| Quote text | 44px, bold, text color, preceded by 120px accent quote mark |
| Body text | 28px, #cbd5e1 (slate-300) |

---

## Architecture Reference

### Key Files in Content Flywheel

| File | Purpose |
|------|---------|
| `src/lib/image-templates/news-card.tsx` | Single news card JSX template |
| `src/lib/image-templates/news-carousel.tsx` | Multi-slide carousel JSX templates (cover, stat, point, quote, cta) |
| `src/lib/image-templates/renderer.ts` | Satori + resvg rendering engine |
| `src/lib/image-templates/assets.ts` | Asset fetching (og:image, Clearbit logos, base64 conversion) |
| `src/lib/image-templates/render-pipeline.ts` | Orchestration: content item → rendered PNGs |
| `src/lib/types.ts` | `BrandDesignSystem`, `Brand`, `NewsCarouselSlide` types |

### Template Types

```typescript
// news-carousel.tsx
type NewsCarouselSlide = {
  type: 'cover' | 'stat' | 'point' | 'quote' | 'cta';
  headline: string;
  body?: string;
  heroImageUrl?: string | null;
  stat?: string;
  statLabel?: string;
  quote?: string;
  quoteAttribution?: string;
  slideNumber?: number;
  totalSlides?: number;
  ctaText?: string;
};

// news-card.tsx
type NewsCardData = {
  headline: string;
  category?: string;
  heroImageUrl?: string | null;
  companyLogoUrl?: string | null;
  brandLogoUrl?: string | null;
  sourceAttribution?: string;
  brandName: string;
  brandColors: { background: string; primary: string; text: string; secondary: string };
};
```

---

## LinkedIn & Instagram Optimization

1. **Format: 1080×1080 square** — works on both LinkedIn and Instagram feed
2. **5-7 slides** — sweet spot for engagement (not too short, not too long)
3. **Slide 1 stops the scroll** — bold headline, hero image if available
4. **One idea per slide** — scannable in 2 seconds
5. **Data slides create dwell time** — big stats keep people swiping
6. **Quote slides add credibility** — real attribution, real quotes
7. **CTA slide drives follows** — brand name + logo + clear action

---

## Error Handling

- **Font loading failure**: Satori needs TTF format. The renderer fetches Inter from Google Fonts with `User-Agent: 'Mozilla/4.0'` to force TTF response.
- **Logo fetch failure**: If `imageToBase64(logoUrl)` fails, pass `null` — templates gracefully fall back to text-only brand mark.
- **Hero image failure**: If og:image extraction fails, pass `null` — cover slide adjusts layout (larger headline, centered).
- **Render script import error**: Script MUST be in the project directory, not `/tmp`. Relative imports `./src/lib/...` require the correct working directory.
- **resvg not found**: Ensure `serverExternalPackages: ['@resvg/resvg-js']` is in `next.config.ts`.

## Notes

- Templates are deterministic — same input = same pixels. Visual consistency is guaranteed by code, not AI.
- The pipeline starts with research — never fabricate statistics or quotes.
- Every data point must be verifiable and attributed.
- Brand colors come from `design_system.colors` — these are the single source of truth.
- The brand logo is converted to base64 data URL for Satori embedding (Satori can't fetch remote URLs at render time).
- Always open generated images for user review.
- Clean up render scripts after use — don't leave them in the project directory.
