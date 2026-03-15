# n8n Workflow Apps

This project turns n8n workflows into production web apps deployed on Vercel.

## Architecture

Each workflow becomes its own standalone Next.js app with its own GitHub repo.

```
~/n8n-apps/
├── CLAUDE.md          # This file (shared project guidance)
└── <app-name>/        # Each app is a separate Next.js project + GitHub repo
    ├── src/
    │   ├── app/           # Next.js App Router pages
    │   ├── components/    # React components
    │   ├── lib/           # n8n webhook helpers, types
    │   └── styles/        # Tailwind / global styles
    ├── public/
    ├── package.json
    └── CLAUDE.md          # App-specific notes (workflow ID, webhook URLs, etc.)
```

## Workflow: From n8n to Deployed App

### 1. Audit the n8n workflow
- Use the n8n MCP to inspect the target workflow
- Verify it has a **Webhook trigger node** (POST) for receiving data from the app
- Verify it has a **Respond to Webhook node** returning structured JSON
- Confirm input schema (what fields the webhook expects)
- Confirm output schema (what the response JSON looks like)
- Fix any issues directly via the n8n MCP

### 2. Scaffold the Next.js app
- `npx create-next-app@latest <app-name>` with App Router, TypeScript, Tailwind
- Build the frontend that collects user input and displays results
- Wire up the webhook call in a server action or API route (keeps the webhook URL server-side)

### 3. Test locally
- Run `npm run dev` and verify the full roundtrip: form → n8n webhook → response → UI

### 4. Push to GitHub
- Use the GitHub MCP to create the repo and push
- Repo naming convention: `n8n-<app-name>`

### 5. Deploy to Vercel
- Connect the GitHub repo to Vercel so future pushes auto-deploy
- Set any environment variables (e.g. `N8N_WEBHOOK_URL`)

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **n8n:** Cloud instance (webhooks via HTTPS)
- **Hosting:** Vercel (auto-deploy from GitHub)

## Conventions

- Webhook URLs go in `.env.local` as `N8N_WEBHOOK_URL`, never hardcoded
- All n8n calls happen server-side (server actions or API routes) — no exposing webhook URLs to the client
- Keep apps minimal: one workflow = one focused UI
- Use the n8n MCP for reading/modifying workflows
- Use the GitHub MCP for repo creation and pushes

## Available Tools

- **n8n MCP** — inspect and modify workflows, nodes, and webhook configs
- **n8n skill** — n8n domain knowledge (nodes, patterns, templates)
- **Frontend designer skill** — UI/UX guidance for building the app interface
- **GitHub MCP** — create repos and push code

## Skills

- `/frontend-vibe` — End-to-end frontend pipeline. Orchestrates mockup generation (Nano Banana 2), design system (UI/UX Pro Max), and animated components (21st.dev Magic MCP). Self-improving via persistent feedback memory at `~/.claude/memory/frontend-vibe/`. Trigger with "build frontend", "design the app", "make it look good", etc.
- `/saas-setup` — SaaS infrastructure for Next.js + Supabase + Vercel apps. Sets up Google OAuth (optional Apple), Lemon Squeezy payments & subscriptions, webhook handler with signature verification, subscription gating (`useSubscription` hook + `<ProOnly>` component), legal pages via Termly, and a locked-down Supabase schema with RLS. Trigger with "set up auth", "add payments", "make this a paid app", etc.
- `/security-audit` — Comprehensive, non-developer-friendly security audit. Covers 6 phases: project discovery, secret/credential exposure, API & backend security, data & user safety, infrastructure & deployment, and a final report with severity-rated findings. Trigger with "security check", "audit my app", "is my app safe", "check for exposed secrets", etc.
- `/linkedin-profile-optimizer` — Analyzes and optimizes LinkedIn profiles (personal or company) for visibility, credibility, and engagement. Covers headline, about section, banner, photo/logo, featured section, experience, skills, custom URL, creator mode. Runs a discovery interview first, then audits and rewrites. Hard anti-AI-slop rules ensure output sounds human. Trigger with "optimize my LinkedIn", "audit my LinkedIn profile", "improve my LinkedIn headline", etc.
- `/infographic-generator` — Branded AI infographic pipeline for LinkedIn. Two-step process: Claude structures data → Nano Banana Pro (Gemini 3 Pro Image) renders with brand style. Auto-uses brand's `prompt_style_block` for visual consistency. Supports product-specific branding in comparison infographics (e.g., Anthropic's cream/terracotta vs OpenAI's white/green). Trigger with "create infographic", "generate infographic", "make an infographic about", "infographic comparing", etc.
- `/carousel-generator` — Branded news carousel & card pipeline for LinkedIn/Instagram. Template-based (Satori JSX→PNG) for pixel-perfect consistency. Generates multi-slide carousels (cover, stat, point, quote, cta) + single news cards. Uses brand's `design_system.colors` and `logo_url` automatically. Trigger with "create carousel", "generate carousel", "make a carousel about", "news card", etc.
- `/linkedin-strategy` — **THE BIBLE.** LinkedIn algorithm enforcer based on 2026 playbook (600K+ posts analyzed). Auto-checks and auto-fixes violations in all LinkedIn-related work: no hashtags, links in first comment only, carousel-first content, 8hr gap between posts, Tue-Thu 9-11AM optimal, golden window protocol, saves-first optimization. Activates automatically on any LinkedIn-related work. Invoke explicitly with "check LinkedIn strategy", "audit LinkedIn compliance", etc.
