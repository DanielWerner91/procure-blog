---
name: linkedin-strategy
description: "LinkedIn algorithm bible. Enforces 2025-2026 playbook rules across all LinkedIn work: content generation, publishing, engagement, scheduling, commenting. Auto-checks and auto-fixes violations. Use when: creating LinkedIn content, reviewing posts, configuring publishing, discussing LinkedIn strategy, building engagement features, or any LinkedIn-related code/config change."
---

# LinkedIn Strategy Enforcer

This skill is the enforcement layer for the LinkedIn Growth Playbook (March 2026, 600K+ posts analyzed). It is the authoritative source for ALL LinkedIn decisions in this project. When activated, it audits the current context against playbook rules and either auto-fixes violations or flags them.

## When This Skill Activates

ALWAYS activate when:
- Creating or reviewing LinkedIn post content
- Modifying Content Flywheel code that touches LinkedIn publishing
- Configuring posting schedules or frequency
- Working on engagement/commenting features
- Discussing LinkedIn growth strategy
- Generating carousels, infographics, or any content destined for LinkedIn
- Reviewing AI-generated captions or post text for LinkedIn

## The Rules (Non-Negotiable)

### 1. HASHTAGS ARE DEAD ON LINKEDIN

LinkedIn disabled hashtag pages in October 2024. Hashtags no longer drive feed discoverability.

| Hashtag Count | Effect |
|---|---|
| 0 | Best practice. Many top creators use zero. |
| 1-2 | Acceptable. Marginal search benefit only. |
| 3+ | **Actively hurts reach.** |
| 6+ | **Penalty territory.** |

**Enforcement:**
- Any LinkedIn post content containing hashtags → REMOVE THEM or flag
- AI prompts generating LinkedIn content must explicitly say "no hashtags"
- Brand hashtags are still valid for LinkedIn discovery/search (Serper.dev), NOT for post content
- Other platforms (Instagram, Bluesky, Twitter) still use hashtags normally

### 2. LINKS KILL LINKEDIN REACH

| Link Count | Effect |
|---|---|
| 0 links | Best for reach. Always safe. |
| 1 link | **Worst performer.** Looks promotional. Tanks reach. |
| 2-3 links | Flat performance, may trigger comments. |
| 4+ links | 3-5x higher reach than single link. Signals curated value. |

**Enforcement:**
- NEVER put a single external link in a LinkedIn post body
- If a source URL is needed → put it in the **first comment**, not the post
- AI-generated LinkedIn captions must say "link in comments" if referencing a source
- When building publish features: add auto-first-comment capability for LinkedIn source URLs

### 3. POST STRUCTURE — THE HOOK IS EVERYTHING

LinkedIn shows only the first 2-3 lines before "See More". The hook determines click-through rate and read time — both major algorithm signals.

**Required hook patterns:**
- Bold, specific claim: "Most LinkedIn growth advice is completely wrong. Here is what the data shows."
- Surprising number: "94% of LinkedIn posts get fewer than 200 views. Here's why yours can be in the top 6%."
- Provocative question the audience genuinely wonders about

**Banned openers:**
- "I am excited to share..."
- "Today I want to talk about..."
- Starting with company name
- Starting with promotional message
- Starting with emojis like rocket/fire

**Post length sweet spot:** 800-1,000 characters for most post types.

### 4. CONTENT FORMAT HIERARCHY

When choosing what type of content to create for LinkedIn, follow this ranking:

| Rank | Format | Reach Multiplier | Notes |
|---|---|---|---|
| 1 | Polls | 1.64x | Use sparingly — over-use looks spammy |
| 2 | Document/Carousels (PDF) | 1.45x | **PRIMARY FORMAT.** 278% more engagement than video, 600% more than text, 4-6x more saves |
| 3 | Images | 1.18x | Infographics, data visualizations |
| 4 | Video | 1.10x | Native only, vertical 9:16, caption everything (85% watched on mute) |
| 5 | Text only | 1.0x (baseline) | Lowest reach. Only for hot takes or personal stories |
| 6 | LinkedIn Live | 7x video | High effort, highest impact for events |

**Enforcement:**
- Default content type for LinkedIn should be carousels
- Text-only posts should be rare and have exceptional hooks
- Never upload YouTube links — native video only
- All video must be captioned

### 5. IDEAL CONTENT MIX

| Category | Share | Purpose |
|---|---|---|
| Educational Carousels | 40% | How-tos, frameworks — earn saves (strongest algorithm signal) |
| Personal Stories & Opinions | 25% | Highest comment engagement, emotional connection |
| Polls + Commentary | 20% | Drives votes + substantive comments |
| Native Video | 10% | 60-90 sec, vertical, captioned |
| Promotional / Soft CTA | 5% | Max 1 per 3-4 weeks. LinkedIn suppresses promotional content. |

**Enforcement:**
- Flag if content calendar is >10% promotional
- Flag if no carousels are scheduled for a week
- Promotional content more than once per 3 weeks → warning

### 6. POSTING SCHEDULE

| Factor | Rule |
|---|---|
| Frequency (starting) | 3-5x/week |
| Frequency (established) | 5+/week (3.5x more monthly views vs 2-3/week) |
| Company page minimum | 2-3x/week |
| Best days | Tuesday, Wednesday, Thursday (Tuesday often highest) |
| Worst days | Saturday, Sunday |
| Best time | 9:00-11:00 AM target audience timezone |
| Secondary windows | 12-1 PM (lunch), 4-6 PM (end of day) |
| Minimum gap | **8 hours between posts** (two posts closer cannibalize each other) |
| Avoid | Late evening (10 PM+), early morning (before 7 AM) |

**Enforcement:**
- Cron publish schedule should target 9-11 AM
- If two posts scheduled within 8 hours → flag or auto-space
- Weekend posts should be deprioritized or skipped
- Consistency of schedule > perfect timing (pick a time and stick to it)

### 7. GOLDEN WINDOW (First 60 Minutes)

The first hour after posting determines whether LinkedIn expands distribution or buries the post **forever**. There is no second chance.

**Protocol:**
1. **Pre-post (30 min before):** Comment on 5-10 posts in niche (warms algo, +20% reach)
2. **Immediately after posting:** Post first comment (bonus insight, question, or source link)
3. **First 60 minutes:** Reply to every comment within 15 minutes
4. **Comment depth:** Threads 3+ exchanges deep get 5.2x amplification

**Enforcement:**
- When publishing LinkedIn content, prompt user about golden window engagement
- Auto-first-comment feature is high priority
- If building notification features, notify user immediately when post goes live

### 8. ENGAGEMENT & COMMENTING RULES

| Factor | Guideline |
|---|---|
| Daily comments | 10-20 substantive comments on others' posts |
| Comment timing | Within first 30-60 min of target posts for max exposure |
| Target accounts | Creators with 5K-50K followers in your niche |
| Pre-post warmup | 20 min commenting before posting (+20% reach) |

**Comment quality rules (already enforced in engagement-scorer.ts):**
- NEVER: "Great post!", "So true!", "This resonates", "Couldn't agree more"
- DO: Add new dimension, share data point, ask follow-up question, respectfully disagree
- Max 2-3 comments on same post (more looks automated)
- Comments from irrelevant niches are a red flag

### 9. CONTENT THAT KILLS REACH

**Auto-flag or auto-fix these:**
- Pure AI-generated content without humanizer pass (20-30% lower engagement)
- Active selling in posts (up to 70% reach reduction)
- Engagement bait: "Comment YES if you agree!", "Tag someone who needs this"
- Reposting identical content across platforms without changes
- Inconsistent posting (2+ week gaps signal inactivity to algorithm)

### 10. COMPANY PAGE vs PERSONAL PROFILE

| Metric | Personal Profile | Company Page |
|---|---|---|
| Reach | 561% more | Baseline |
| Follower reach per post | Large slice | 1.6-2% of followers |
| Trust | 3x more trusted | Brand trust |
| Lead conversion | 7x higher | Baseline |

**Strategy:**
- Company page = secondary hub (legitimacy, recruitment, paid amplification)
- Personal profiles = primary distribution channel
- Content lives first on personal profile, then reshared to company page
- Employee-shared content is the highest-leverage activity

### 11. SAVES ARE THE #1 METRIC

Saves (bookmarks) are the strongest signal of content quality on LinkedIn. Creators whose posts get saved consistently grow 3x faster.

**Enforcement:**
- Optimize content for save-worthiness: frameworks, checklists, data, how-tos
- Track saves as primary KPI over likes/impressions
- Carousels get 4-6x more saves than other formats (reinforces carousel-first strategy)

### 12. PROFILE OPTIMIZATION

- Headline: Who you help + how (NOT job title)
- Enable Creator Mode (Follow > Connect as primary CTA)
- Photo: Professional, warm, high contrast, face visible (14x higher view rate)
- Banner: Visual CTA — value proposition + what you post about
- About: First 2-3 lines before "See More" must be compelling
- Featured: Pin 3 best-performing posts
- Every section reinforces 1-2 topics you post about

---

## Audit Checklist

When this skill is activated, run through this checklist against the current context:

- [ ] No hashtags in LinkedIn post content
- [ ] No single links in LinkedIn post body (0 or 4+ only, or link in first comment)
- [ ] Hook is strong (first 2 lines grab attention, no banned openers)
- [ ] Post is 800-1,000 characters (unless carousel caption, which is shorter)
- [ ] Content format is optimal (carousel > image > video > text)
- [ ] Not posting within 8 hours of another post
- [ ] Scheduled for Tue-Thu, 9-11 AM target timezone
- [ ] Content passed humanizer (no pure AI output)
- [ ] No engagement bait or promotional language
- [ ] No more than 5% promotional content in recent calendar
- [ ] Caption for visual content is SHORT (2-3 sentences — visual carries the detail)
- [ ] Saves-worthy content (frameworks, data, how-tos over fluff)

## Integration Points in Content Flywheel

| File | What to Check |
|---|---|
| `src/lib/ai/content-generator.ts` | LinkedIn platform constraints, no hashtags in prompts, hook guidance |
| `src/lib/ai/rich-content-generator.ts` | Infographic/carousel captions — no hashtags for LinkedIn |
| `src/lib/ai/humanizer.ts` | LinkedIn tone — professional but personable, no AI patterns |
| `src/lib/ai/engagement-scorer.ts` | Comment quality rules aligned with playbook |
| `src/app/api/cron/publish/route.ts` | Publishing schedule (8hr gap, time targeting) |
| `src/app/api/cron/generate/route.ts` | Content mix balance |
| `src/app/api/cron/engage/route.ts` | Commenting strategy alignment |
| `src/lib/platforms/linkedin.ts` | No hashtags appended to post text |
| `src/lib/discovery.ts` | Brand hashtags OK for search/discovery (Serper.dev) |
| `src/app/api/cron/plan/route.ts` | Content planning — carousel-first, right mix |

## Growth Timeline (Realistic Benchmarks)

With consistent execution of all rules above:
- **1,000 followers:** 60-90 days
- **5,000 followers:** 4-6 months
- **10,000 followers:** 8-14 months

Requirements: 5x/week posting, carousel-first content, 15-20 comments/day, mutual growth network of 10+ peers.

---

*Source: LinkedIn Growth Playbook, March 2026. Based on analysis of 600,000+ posts, Buffer 2M+ post dataset, Richard van der Blom research, and 94,000+ account analysis.*
