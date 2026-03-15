---
name: infographic-generator
description: "Generate branded, information-dense infographics for LinkedIn. Two-step pipeline: Claude structures data → Nano Banana Pro renders image with brand style. Supports product-specific branding in comparisons. Actions: create, generate, design, make infographic. Triggers: create infographic, generate infographic, make an infographic about, infographic comparing, design infographic, branded infographic, LinkedIn infographic."
---

# Infographic Generator — Branded AI Infographic Pipeline

Generates publication-ready, information-dense infographics for LinkedIn using a two-step pipeline: Claude structures the content data → Nano Banana Pro (Gemini 3 Pro Image) renders the final image with brand-consistent styling. Every infographic inherits the brand's design system automatically.

## When This Skill Activates

Use when the user requests any of:
- Creating or generating an infographic (any topic)
- Making a comparison infographic between products/brands
- Generating LinkedIn visual content for a brand
- Creating branded data visualizations
- Any infographic request flowing through the Content Flywheel

## Brand Guidelines Enforcement

Every infographic MUST reflect the brand's full design system:
- **Colors**: Use the exact hex values from `design_system.colors` (primary, secondary, accent, background, text)
- **Typography**: Use the brand's heading and body fonts from `design_system.typography`
- **Logo**: If `logo_url` is set on the brand, include the logo in the footer section (bottom-right, small and tasteful)
- **Visual Identity**: Follow `design_system.visual_identity` for logo placement, brand pattern, and consistent elements
- **Brand Voice**: The infographic's tone and terminology must match `brand_voice` (archetype, tone, vocabulary)
- **Infographic Style**: The `prompt_style_block` is the single source of truth — it encodes all of the above into a frozen prompt prefix

## Pipeline Overview

```
[1. CONTEXT] → [2. RESEARCH] → [3. STRUCTURE] → [4. PROMPT BUILD] → [5. GENERATE] → [6. DELIVER]
```

---

## Phase 1: Context Gathering

Before generating, understand the brand and topic:

1. **Identify the brand** — which Content Flywheel brand is this for?
   - Load brand data from Supabase or use the API: `GET /api/brands/[slug]`
   - Key fields: `design_system` (colors, typography, infographic config), `brand_voice`, `content_pillars`

2. **Extract the infographic style** from `brand.design_system.infographic`:
   - `prompt_style_block` — the frozen prompt prefix for visual consistency
   - `visual_style` — narrative description of the aesthetic
   - `aspect_ratio` — default `4:5` (1080×1350px, LinkedIn optimal)
   - `icon_style`, `stat_display_style`, `section_style`, `color_coding`

3. **If no infographic config exists** — call `generateInfographicStyle()` from `src/lib/ai/infographic-style.ts` to auto-generate one from brand data.

**Output:** Brand context + infographic style block ready.

---

## Phase 2: Topic Research

For every infographic, ensure data accuracy:

1. **Use WebSearch** to find current, accurate data points for the topic
2. **Verify statistics** — every number must be real and attributable
3. **Find 3-5 compelling data points** that tell a story
4. **Note sources** for attribution in the footer

### For Comparison Infographics

When comparing products/brands (e.g., Claude vs ChatGPT):
1. Research BOTH products with current data (features, benchmarks, pricing, dates)
2. Find the **brand design language** of each product:
   - Official brand colors, typography, visual style
   - Example: Anthropic uses warm cream/paper texture + terracotta orange (#D4845C) + black serif headlines
   - Example: OpenAI uses clean white + green (#10A37F) + modern sans-serif
3. Collect official logos or product imagery if available
4. Identify key comparison dimensions (features, performance, pricing, use cases)

**Output:** Verified data points, sources, and (for comparisons) brand design languages.

---

## Phase 3: Structure the Content

Build the infographic data structure. This follows the `InfographicSection` format:

### Standard Infographic (5-7 sections)

```json
{
  "headline": "Punchy headline, max 10 words",
  "subtitle": "One sentence context setter",
  "sections": [
    {
      "section_type": "header",
      "title": "Section title",
      "content": "Brief description"
    },
    {
      "section_type": "stat",
      "title": "Key Metric",
      "content": "Context for the number",
      "data_value": "87.3%",
      "data_label": "Accuracy on benchmark",
      "icon_suggestion": "chart-bar"
    },
    {
      "section_type": "comparison",
      "title": "Product A vs Product B",
      "content": "Key differentiator",
      "data_value": "2.5x faster",
      "data_label": "Processing speed"
    },
    {
      "section_type": "list",
      "title": "Key Features",
      "content": "• Feature 1\n• Feature 2\n• Feature 3"
    },
    {
      "section_type": "timeline",
      "title": "Evolution",
      "content": "Q1: Launch → Q2: Scale → Q3: Enterprise"
    },
    {
      "section_type": "quote",
      "title": "Expert Take",
      "content": "\"Quote from authoritative source\" — Name, Title"
    },
    {
      "section_type": "footer",
      "title": "Brand Name",
      "content": "Source: Attribution line"
    }
  ],
  "source_attribution": "Sources: Name 1, Name 2"
}
```

### Section Types

| Type | Purpose | Key Fields |
|------|---------|------------|
| `header` | Title/intro section | title, content |
| `stat` | Big number callout | data_value (the number), data_label, icon_suggestion |
| `comparison` | Side-by-side data | data_value, data_label for both sides |
| `timeline` | Chronological flow | content with arrow/flow notation |
| `list` | Bullet points | content with bullet items |
| `quote` | Expert/source quote | content with attribution |
| `footer` | Brand + source | title (brand), content (sources) |

**Output:** Structured JSON data for the infographic.

---

## Phase 4: Build the Image Prompt

Compose the final prompt for Nano Banana Pro image generation.

### Standard Brand Infographic

```
[BRAND PROMPT_STYLE_BLOCK — from brand.design_system.infographic.prompt_style_block]

## CONTENT

HEADLINE at top in large bold text: "[headline]"
SUBTITLE below in smaller text: "[subtitle]"

CONTENT SECTIONS (render each as a distinct visual block with icons, data callouts, and clear hierarchy):

1. [SECTION_TYPE]: "[title]"
   [Rendering instructions based on section_type]
   Detail: [content snippet]

2. STAT: "[title]" — Show "[data_value]" in large bold text with label "[data_label]" (icon: [icon_suggestion])
   Detail: [content]

[... all sections ...]

FOOTER: "[source_attribution]"
```

### Comparison Infographic (Product vs Product)

For comparison infographics, use a **split-design** approach with product-specific branding:

```
Create an information-dense comparison infographic for LinkedIn.

## LAYOUT
Split design — left half for [Product A], right half for [Product B].
Wrapped in [Brand Name]'s frame/border using brand colors.
Aspect ratio: 4:5 portrait (1080×1350px).

## LEFT SIDE — [Product A] Design Language
Background: [Product A's brand color/texture]
Typography: [Product A's font style]
Accent color: [Product A's accent]
[Describe Product A's visual identity — e.g., "warm cream paper texture, terracotta orange (#D4845C) accents, black serif headlines, grid layout with orange icon squares"]

## RIGHT SIDE — [Product B] Design Language
Background: [Product B's brand color/texture]
Typography: [Product B's font style]
Accent color: [Product B's accent]
[Describe Product B's visual identity — e.g., "clean white background, green (#10A37F) accents, modern sans-serif, minimal flat design"]

## WRAPPER FRAME — [Brand Name] Identity
Border/frame: [Brand's primary and secondary colors]
Brand mark: "[Brand Name]" watermark at bottom
[Use brand's prompt_style_block for the outer frame styling]

## CONTENT
[Structured comparison data from Phase 3]

## QUALITY RULES
- Text MUST be crisp, spelled correctly, and readable at mobile phone size
- Every data point must be accurate and clearly labeled
- Each side should feel authentically like that brand's design language
- Use generous whitespace between sections
- NO watermarks (except brand mark), NO stock photo elements
- Information-dense but well-organized with clear visual hierarchy
```

### Known Brand Design Languages (Reference)

When creating comparison infographics about these brands, use their actual design language:

| Brand | Colors | Style |
|-------|--------|-------|
| Anthropic/Claude | Cream/paper bg, terracotta #D4845C, black text | Warm editorial, serif headlines, grid layout, orange icon squares |
| OpenAI/ChatGPT | White bg, green #10A37F, dark text | Clean minimal, sans-serif, flat design, green accents |
| Google/Gemini | White bg, blue #4285F4, multi-color accents | Material Design, rounded shapes, gradient blues |
| Meta/Llama | Blue #0668E1, white bg | Corporate tech, bold sans-serif, blue gradient |
| Microsoft/Copilot | White bg, multi-gradient (blue→purple→orange) | Fluent Design, rounded, colorful gradient |
| Apple Intelligence | Black bg, rainbow gradient | Minimalist, SF Pro, glowing color effects |

Add to this table as new brand comparisons are created.

**Output:** Complete image generation prompt.

---

## Phase 5: Generate the Image

Use **Nano Banana Pro (Gemini 3 Pro Image)** via MCP for highest quality:

```
mcp__nanobanana__generate_image
  prompt: [the complete prompt from Phase 4]
  model: "gemini-3-pro"
  aspect_ratio: "4:5"
```

### Model Selection

| Model | Use When |
|-------|----------|
| `gemini-3-pro` | **Default.** Best reasoning, most accurate text rendering, highest quality |
| `gemini-3.1-flash` | Quick iterations, drafts, when speed > quality |

### Multi-Image Conditioning (Advanced)

When a reference image is available (e.g., user provides a style example):
```
mcp__nanobanana__generate_image
  prompt: [prompt]
  model: "gemini-3-pro"
  input_image_path_1: [path to reference image]
```

This is especially useful for:
- Matching a specific brand's visual style from an example
- Creating series of infographics with consistent look
- Reproducing a particular layout or design approach

### Quality Checks

After generation, verify:
- [ ] Text is legible and correctly spelled
- [ ] Data values match the research
- [ ] Brand colors are present and correct
- [ ] Brand logo appears in footer (if `logo_url` is set on the brand)
- [ ] Brand fonts/typography are reflected in the design
- [ ] Layout has clear visual hierarchy
- [ ] No AI artifacts (extra fingers, garbled text, etc.)
- [ ] Aspect ratio is correct (portrait 4:5)

If quality fails, regenerate with more specific instructions targeting the issue.

**Output:** Generated infographic image.

---

## Phase 6: Deliver & Store

1. **Open the image** for the user to review:
   ```bash
   open [image_path]
   ```

2. **If generating through the Content Flywheel API** (not ad-hoc):
   - The image flows through `/api/content/generate-image` which handles:
     - OpenRouter API call with the prompt
     - Upload to Supabase Storage (`content-images` bucket)
     - Update `content_items.media_urls` with the public URL
     - Set `generation_metadata.ai_image_generated: true`

3. **If generating ad-hoc** (user asks directly in conversation):
   - Use Nano Banana MCP directly
   - Save to `/Users/danielwerner/nanobanana-images/temp_images/`
   - Open for user review

---

## LinkedIn Optimization Rules

These are hard constraints for all LinkedIn infographics:

1. **Aspect ratio: 4:5 portrait** (1080×1350px) — maximizes feed real estate
2. **Information-dense** — LinkedIn's algorithm rewards dwell time; more data = more engagement
3. **Mobile-first text sizing** — all text must be readable on a phone screen without zooming
4. **Clear visual hierarchy** — scannable in 3 seconds, readable in 30 seconds
5. **Brand watermark** — small, bottom-right, not distracting
6. **Source attribution** — always cite data sources (builds credibility, LinkedIn values this)
7. **No generic AI look** — LinkedIn's AI Quality Classifier penalizes obviously AI-generated content; use brand-specific styling to differentiate

## Completeness Rules (MANDATORY — Zero Tolerance)

These apply to ALL infographics, every time, no exceptions:

1. **NEVER use "..." or ellipsis** to truncate any content — not in tables, lists, stats, labels, or any text
2. **Every table cell must be complete** — if a comparison table row shows "Cl..." or "..." that is an automatic rejection
3. **Fewer items, fully shown** — if content won't fit, REDUCE the number of items/rows/points rather than truncating any individual item
4. **No partial words** — every word must be complete and readable
5. **No placeholder abbreviations** — don't abbreviate product names, features, or labels to save space
6. **Self-contained topic** — generate content about the requested topic ONLY. Do NOT inject the brand's domain expertise (e.g., procurement) unless the topic specifically calls for it. The brand voice guides tone and style, NOT topic selection.

## Personal Brand CTA Footer

For brands without a logo (e.g., personal brands like "Daniel Werner"):
- The code will overlay a text-only badge with brand name + CTA at bottom-right
- The CTA text comes from the brand's `prompt_style_block` `## FOOTER` section
- If no footer is defined, defaults to "Subscribe to our newsletter"
- For personal brands, use CTAs like "Follow [Name] on LinkedIn for more [topic] insights"

---

## Architecture Reference

### Key Files in Content Flywheel

| File | Purpose |
|------|---------|
| `src/lib/ai/infographic-style.ts` | Auto-generates infographic style from brand data |
| `src/lib/ai/rich-content-generator.ts` | `generateInfographic()` — Claude structures content |
| `src/app/api/content/generate-image/route.ts` | `buildInfographicPrompt()` + OpenRouter image API |
| `src/app/api/brands/[slug]/regenerate-infographic-style/route.ts` | Regenerate style from brand |
| `src/app/brands/[slug]/design/page.tsx` | UI for editing infographic style settings |
| `src/lib/types.ts` | `InfographicSection`, `BrandDesignSystem` types |

### Brand Design System → Infographic Config

```typescript
brand.design_system.infographic = {
  visual_style: string;         // "modern thought-leadership with bold headlines..."
  aspect_ratio: '4:5';          // LinkedIn optimal
  icon_style: string;           // "solid rounded-square icons with white line art"
  stat_display_style: string;   // "oversized bold number with colored circle bg"
  section_style: string;        // "card-based with shadow and rounded corners"
  color_coding: string;         // Semantic color → role mapping
  prompt_style_block: string;   // FROZEN ~30-line prompt prefix for all images
}
```

### Personality Archetype → Visual Style Mapping

| Archetype | Visual Style |
|-----------|-------------|
| `news-outlet` | Clean editorial, newspaper hierarchy, authoritative typography |
| `thought-leader` | Modern bold headlines, clean data viz, professional whitespace |
| `bold-challenger` | High-contrast, bold color blocks, geometric shapes, impactful |
| `nerdy-builder` | Technical grid, monospace accents, detailed data visualization |
| `wise-mentor` | Warm professional, approachable, clear info hierarchy |
| Default | Professional clean with smart dark/light theme detection |

---

## Error Handling

- **Nano Banana timeout**: Retry once with same prompt. If still fails, try `gemini-3.1-flash` model.
- **Bad text rendering**: Add explicit instruction: "Ensure all text is perfectly spelled and crisp. Double-check: [list specific words that were garbled]"
- **Wrong colors**: Repeat hex values in the prompt with emphasis: "MUST use exact hex: #D4845C for accent, #F5F0EB for background"
- **Missing brand style**: Generate one on the fly using `generateInfographicStyle()` with whatever brand data is available
- **Comparison imbalance**: If one side has more data, pad the other with contextual info to keep visual balance
- **Image too busy**: Reduce sections from 7 to 5, increase whitespace instructions
- **AI-looking output**: Add "hand-crafted editorial design, NOT generic AI-generated look" to prompt

## Notes

- The pipeline always starts with research — never fabricate statistics
- Every data point must be verifiable and attributed
- Brand consistency comes from the `prompt_style_block` — this is the single source of truth for visual style
- For comparison infographics, the outer frame uses the publishing brand's style, inner panels use each product's brand language
- The skill improves over time as more brand design languages are documented in the reference table
- Always open the generated image for the user to review — don't just say it was generated
