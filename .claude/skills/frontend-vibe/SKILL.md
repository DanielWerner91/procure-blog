---
name: frontend-vibe
description: "End-to-end modern frontend pipeline for n8n webapps. Sources real components from 21st.dev registry (WebGL shaders, Three.js, GSAP animations), generates mockups (Nano Banana 2), applies design intelligence (UI/UX Pro Max). Self-improving via persistent feedback memory. Actions: build, design, create, vibe, frontend, app, webapp, page, landing. Triggers: build frontend, create app UI, design the app, vibe code the frontend, make it look good."
---

# Frontend Vibe -- Intelligent Frontend Pipeline

Sources real, production-quality components from 21st.dev's community registry and orchestrates them into polished frontends for n8n webapp projects. Each build feeds back into a persistent memory that makes future builds smarter.

## When This Skill Activates

Use when the user requests any of:
- Building a frontend / UI for an n8n webapp
- Creating or designing app pages, layouts, landing pages
- "Make it look good", "vibe code the frontend", "design the app"
- Any request to create visual UI for a project in ~/n8n-apps/

## Pipeline Overview

```
[1. CONTEXT] -> [2. VISION] -> [3. COMPONENT SOURCING] -> [4. BUILD] -> [5. REFINE] -> [6. LEARN]
```

---

## Phase 1: Context Gathering

Before anything, understand what we're building:

1. **Read the app's CLAUDE.md** to understand the n8n workflow, webhook schema, and data shape
2. **Identify the app type**: form -> result, dashboard, single-page tool, multi-step wizard
3. **Check feedback memory** at `~/.claude/memory/frontend-vibe/` for:
   - Past builds for similar app types (patterns that worked)
   - Design decisions that got positive user feedback
   - Anti-patterns and mistakes to avoid
   - Preferred styles/palettes/components from history

Read these memory files (if they exist):
- `~/.claude/memory/frontend-vibe/preferences.md` -- hard constraints (read first)
- `~/.claude/memory/frontend-vibe/builds.jsonl` -- scan for similar app types
- `~/.claude/memory/frontend-vibe/patterns.md` -- positive patterns to apply
- `~/.claude/memory/frontend-vibe/anti-patterns.md` -- mistakes to avoid
- `~/.claude/memory/frontend-vibe/21st-dev-registry.md` -- registry API docs and known components

**Output:** A brief context summary with app type, data flow, and any lessons from memory.

---

## Phase 2: Creative Vision

Generate a bold aesthetic direction -- NOT generic AI slop:

1. **Consider the app's purpose** -- a health tracker feels different from a meme generator
2. **Pick an intentional aesthetic direction**: minimalist luxury, soft organic, bold editorial, retro-futuristic, glassmorphic depth, etc.
3. **Reference memory** -- if user has shown preference for certain styles, lean into those
4. **Plan which 21st.dev components to use** -- map each page section to a real component category:
   - Hero background: shader/WebGL/aurora/particles
   - Hero text: animated hero, text reveal, typewriter
   - Cards/features: display cards, bento grid, glowing effect
   - Scroll effects: container scroll, parallax
   - Navigation: animated navbar, glassmorphic header
   - Buttons: liquid button, shimmer button, metal button
   - Data display: number ticker, marquee, charts
   - Testimonials/social proof: testimonial slider, marquee

**Output:** 2-3 sentence creative brief + a component sourcing plan listing which 21st.dev components to fetch for each section.

---

## Phase 3: Component Sourcing from 21st.dev Registry

**THIS IS THE MOST CRITICAL PHASE.** The quality of the final result depends entirely on using REAL 21st.dev components, not hand-coded approximations.

### Step 1: Discover components

For each section in the component plan, find the right 21st.dev component:

**Method A — MCP Inspiration Search (preferred for discovery):**
```
mcp__magic__21st_magic_component_inspiration with 2-4 word queries
```
Returns 3 results per query with full source code. Good search terms:
- Backgrounds: "shader background", "aurora background", "gradient background", "particles"
- Hero: "animated hero", "hero section", "landing hero"
- Cards: "display cards", "glowing effect", "bento grid", "feature cards"
- Text: "text reveal", "animated text", "typewriter", "gradient text"
- 3D: "3d model", "three.js", "splite", "geometric mesh"
- Scroll: "scroll animation", "container scroll", "parallax"
- Navigation: "navbar", "sidebar", "navigation menu"
- Buttons: "liquid button", "shimmer button", "metal button"
- Pricing: "pricing section", "pricing card"
- Data: "number ticker", "counter animation", "marquee", "stats"

**Method B — Direct Registry Fetch (when you know the component):**
```bash
curl -s 'https://21st.dev/r/<username>/<component-slug>'
```
Returns shadcn registry JSON with:
- `files[].content` — full source code
- `dependencies` — npm packages needed
- `registryDependencies` — other shadcn components needed
- `tailwind.config` — required keyframes/animations
- `cssVars` — CSS custom properties needed

No auth required. URL pattern: extract `username/slug` from any 21st.dev community URL.

### Step 2: Fetch and install each component

For EACH component:

1. **Get the source code** from the registry JSON `files[].content`
2. **Copy verbatim** to `src/components/ui/<component-name>.tsx`
3. **Install npm dependencies** from the `dependencies` field:
   ```bash
   npm install <dep1> <dep2> ...
   ```
4. **Add tailwind config** — if the registry JSON has a `tailwind.config` field with keyframes/animations, add them to `globals.css`:
   - For Tailwind v4: use `@keyframes` + `@utility animate-<name>` blocks
   - For Tailwind v3: add to `tailwind.config.ts` extend section
5. **Install registry dependencies** — if `registryDependencies` lists other shadcn components, fetch those too
6. **Ensure `cn` utility exists** at `src/lib/utils.ts` (requires `clsx` + `tailwind-merge`)

### Step 3: Verify components render

After installing each component, do a quick `npm run build` check to catch type errors early. Common fixes:
- framer-motion type issues: use `as any` for complex animation objects
- Missing `'use client'` directive on components using hooks
- Import path mismatches (`@/lib/utils` vs `@/utils/cn`)

### Known Premium Components (quick reference)

| Component | Registry URL | Use For |
|---|---|---|
| Shader Background | `21st.dev/r/thanh/shader-background` | Hero background (WebGL) |
| WebGL Shader | `21st.dev/r/aliimam/web-gl-shader` | Hero background (Three.js) |
| Glowing Effect | `21st.dev/r/aceternity/glowing-effect` | Card borders, accents |
| Splite (3D) | `21st.dev/r/serafim/splite` | 3D elements |
| Display Cards | `21st.dev/r/Codehagen/display-cards` | Feature showcases |
| Container Scroll | `21st.dev/r/aceternity/container-scroll-animation` | Product reveal |
| Animated Hero | `21st.dev/r/tommyjepsen/animated-hero` | Hero text animations |
| Marquee | `21st.dev/r/magicui/marquee` | Scrolling tickers |
| Number Ticker | `21st.dev/r/dillionverma/number-ticker` | Animated counters |

**CRITICAL RULES:**
- **NEVER hand-code animations** when a 21st.dev component exists for that purpose
- **NEVER approximate** WebGL shaders with canvas 2D or CSS
- **NEVER use framer-motion fade-ins alone** and call it "premium" — those are table stakes
- **Copy source code verbatim** then adapt only colors/content — don't rewrite rendering logic
- **Install real dependencies** (three, gsap, etc.) — don't avoid them to "keep it simple"

---

## Phase 4: Build & Integrate

Compose the sourced components into a complete frontend:

### Component Priority Order

1. **Hero background** — the "wow" effect (WebGL shader, aurora, particles)
2. **Layout shell** — nav + main container + footer
3. **Hero content** — animated text, search bar, CTAs over the background
4. **Feature/content sections** — cards, grids, showcases using sourced components
5. **Social proof** — marquee tickers, number counters, testimonials
6. **Interactive sections** — forms, API previews, code blocks
7. **CTA section** — call to action with button effects
8. **Loading states** — skeleton loaders, transitions

### Integration Rules

- Reusable primitives from 21st.dev go in `src/components/ui/`
- Page-level compositions go in `src/components/` (e.g., HeroSection, FeatureCards)
- Pages use App Router in `src/app/`
- Every component using hooks/effects needs `'use client'`
- Server actions for n8n webhook calls (never expose URLs client-side)
- Adapt the design system colors to the component's color variables

### Color Adaptation

When adapting 21st.dev components to a project's color scheme:
- Find the color values in the component source (hex codes, RGB, HSL)
- Replace with the project's palette while keeping gradients, opacities, and blend modes intact
- For WebGL shaders: modify the `vec3`/`vec4` color values in the fragment shader
- Test that adapted colors maintain sufficient contrast

**Output:** Working frontend with real 21st.dev components integrated.

---

## Phase 5: Refinement Loop

After initial build, run a self-review:

1. **Visual quality check** — does every section have at least one real 21st.dev effect? If any section looks "plain CSS", source a component for it
2. Cross-check against this checklist:
   - No emoji icons (use Lucide/Heroicons SVGs)
   - All clickable elements have `cursor-pointer`
   - Transitions 150-300ms
   - Color contrast 4.5:1 minimum
   - Responsive at 375px, 768px, 1024px
   - `prefers-reduced-motion` respected (add `animation: none !important` overrides)
   - No content hidden behind fixed elements
   - WebGL canvases handle resize properly
3. Run `npm run build` to verify no errors
4. Optionally use `mcp__magic__21st_magic_component_refiner` on key components

**Output:** Refined, production-ready frontend.

---

## Phase 6: Feedback & Learning

After delivery, persist learnings to `~/.claude/memory/frontend-vibe/`.

### Automatic Learning (after every build)

**`~/.claude/memory/frontend-vibe/builds.jsonl`** -- Append one JSON line:
```json
{"date": "YYYY-MM-DD", "app": "<name>", "type": "<type>", "aesthetic": "<direction>", "palette": "<colors>", "typography": "<fonts>", "components_sourced": [{"name": "<name>", "registry": "<user/slug>", "section": "<where used>"}], "signature_moment": "<what>", "refinements_needed": ["<issues>"]}
```

**`~/.claude/memory/frontend-vibe/patterns.md`** -- Update with:
- Which 21st.dev components worked well for which sections
- New components discovered via inspiration search (add to known components)
- Integration patterns that worked cleanly
- Font/palette combinations that produced strong results

**`~/.claude/memory/frontend-vibe/anti-patterns.md`** -- Track what to avoid:
- Components that had type errors or integration issues
- Registry slugs that returned 404 (case-sensitive!)
- Components that broke on mobile or had resize issues

**`~/.claude/memory/frontend-vibe/21st-dev-registry.md`** -- Add any newly discovered components to the Known Premium Components table

### User Feedback Learning

When the user provides feedback (positive or negative):
1. Parse the feedback for specific design signals
2. Update `patterns.md` or `anti-patterns.md` accordingly
3. If user explicitly says "remember this" or "always/never do X", add to `preferences.md`

---

## Error Handling

- **If MCP inspiration tool errors** (common: -32602): Fall back to direct registry fetch via `curl -s 'https://21st.dev/r/<user>/<slug>'`
- **If a registry slug returns 404**: Try alternate casing or search for the component via inspiration tool. Registry slugs are case-sensitive.
- **If Nano Banana fails**: Skip mockup entirely — component sourcing is what matters, not mockups
- **If a component has missing dependencies**: Check `registryDependencies` — it may need another shadcn component fetched first
- **If npm run build fails**: Fix type errors (common: framer-motion types need `any` cast), missing imports, or missing `'use client'`
- **NEVER fall back to hand-coding CSS animations** — always find a real component or ask the user

## Notes

- The pipeline is sequential -- each phase feeds into the next
- Memory files accumulate over time, making the pipeline more opinionated and efficient with each build
- Always prioritize user preferences from `preferences.md` over algorithmic choices
- The quality bar: the result should look indistinguishable from the 21st.dev component showcase pages
- Every page section should have at least one real 21st.dev component powering it
