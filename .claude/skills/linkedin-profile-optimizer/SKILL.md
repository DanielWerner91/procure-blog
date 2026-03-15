---
name: linkedin-profile-optimizer
description: "Use when someone asks to optimize a LinkedIn profile, improve their LinkedIn presence, audit a LinkedIn page, write a LinkedIn headline, rewrite a LinkedIn about section, or improve LinkedIn engagement. Also use when someone mentions LinkedIn SEO, LinkedIn algorithm, or profile visibility."
disable-model-invocation: true
argument-hint: "[LinkedIn profile URL or company page URL]"
---

## What This Skill Does

Analyzes and optimizes a LinkedIn profile (personal or company page) for maximum visibility, credibility, and engagement. Focuses exclusively on profile elements — NOT posts, comments, or content publishing.

**Scope:** Headline, about/summary, banner image, profile photo/logo, featured section, experience descriptions, skills & endorsements, custom URL, creator mode, recommendations strategy, SEO keywords, and profile completeness.

## Important: Anti-AI-Slop Rules

LinkedIn is saturated with AI-generated content. Every output from this skill MUST follow these rules:

1. **No generic motivational language.** Delete any sentence that could apply to anyone. "Passionate about driving results" is useless. What specific results? For whom? How?
2. **No buzzword stacking.** Phrases like "innovative thought leader leveraging synergies to drive transformational outcomes" are instant credibility killers. Use plain language.
3. **Write like the person talks.** Match their existing voice, industry jargon level, and tone. A startup founder sounds different from a procurement director. A 25-year-old sounds different from a 50-year-old.
4. **Specificity over polish.** "Reduced warehouse costs by 31% across 4 distribution centers" beats "Experienced supply chain professional with a proven track record of cost optimization."
5. **No formulaic structures.** Avoid the "[Role] | [Buzzword] | [Buzzword] | [Buzzword]" headline pattern that screams AI. Same for about sections that start with "I'm a [adjective] [role] with [X] years of experience..."
6. **Test every sentence:** Would a real human actually say this out loud? If not, rewrite it.
7. **Imperfection is authentic.** Slightly informal tone, occasional sentence fragments, starting with "Look," or "Here's the thing" — these signal a real person. Don't overdo it. Find the person's natural register and stay there.

## Step 1: Discovery Interview

Before analyzing or writing anything, ask these questions using AskUserQuestion. Ask in rounds — do NOT dump all questions at once.

### Round 1: Profile Basics

- Is this a **personal profile** or a **company/organization page**?
- Share the LinkedIn profile URL (or paste the current headline, about section, and a summary of your experience if you can't share the URL).
- What's the primary goal? Options:
  - **Job hunting** — Get noticed by recruiters and hiring managers
  - **Business development** — Attract clients, partners, or investors
  - **Thought leadership** — Build authority and audience in your space
  - **Recruiting** — Attract talent to your company
  - **Brand awareness** — Increase company visibility
  - Other (let them describe)

### Round 2: Target Audience & Positioning

- **Who needs to find you?** Be specific. Not "recruiters" — what kind? Not "clients" — in which industry, at what company size, with what problem?
- **What should someone think within 3 seconds of landing on your profile?** This is the gut reaction you're designing for.
- **Who are 2-3 people or companies in your space whose LinkedIn presence you respect?** (This helps calibrate tone and positioning, not copy them.)
- **What makes you/your company genuinely different?** Not marketing speak — the real thing. A contrarian opinion, an unusual background, a specific methodology, a niche focus.

### Round 3: Voice & Constraints

- **How formal or informal should the tone be?** Scale of 1-5: (1) Corporate/buttoned-up → (5) Casual/conversational. Most effective profiles land at 3-4.
- **Any words, phrases, or clichés you hate?** (Many people have pet peeves — "synergy," "guru," "ninja," etc.)
- **Anything that MUST be mentioned?** (Certifications, specific achievements, a company tagline, etc.)
- **Anything that must NOT be mentioned?** (Previous employers, specific topics, etc.)

Skip rounds where the user has already provided sufficient context in their initial message.

## Step 2: Profile Audit

After discovery, analyze the current profile across these dimensions. Use web search to pull the actual profile if a URL was provided. Score each element 1-10 and flag specific issues.

### Audit Dimensions

**2a. Headline (120 characters max)**
- Does it communicate value in <2 seconds?
- Does it contain keywords their target audience actually searches for?
- Does it differentiate from the 10,000 other people with the same job title?
- LinkedIn algorithm weight: HIGH — headline text is heavily indexed for search

**2b. Profile Photo / Company Logo**
- Professional quality? Proper lighting, clear face, appropriate background?
- For company pages: Is the logo crisp at small sizes (appears at 60x60px in feeds)?
- Does it match the brand/personal brand positioning from discovery?

**2c. Banner Image (1584 x 396px)**
- Does it reinforce the headline's message or is it a generic cityscape/abstract?
- Does it include a value proposition, CTA, or brand statement?
- Is text readable on mobile (where it crops tighter)?
- Most profiles waste this — it's premium real estate

**2d. About Section (2,600 characters max)**
- Does it hook in the first 2 lines? (Only ~270 characters show before "see more")
- Is it written in first person? (First person outperforms third person for personal profiles)
- Does it answer: Who do you help? What's the problem? What's your approach? What's the result?
- Does it include a clear CTA? (Book a call, visit site, DM me, download X)
- Does it contain searchable keywords naturally woven in (not keyword-stuffed)?

**2e. Featured Section**
- Is it being used at all? (Most people ignore this prime real estate)
- Does it showcase proof: case studies, media mentions, portfolio pieces, lead magnets?
- Are the thumbnails visually compelling or just default link previews?

**2f. Experience Section**
- Are descriptions achievement-based (numbers, outcomes) or responsibility-based (job descriptions)?
- Does each role tell a story arc: situation → action → result?
- Are keywords present for LinkedIn search indexing?
- Rich media attached? (Presentations, projects, publications)

**2g. Skills & Endorsements**
- Top 3 skills aligned with target positioning? (These appear prominently)
- At least 50+ endorsements on primary skills? (Social proof threshold)
- Irrelevant or outdated skills cluttering the list?

**2h. Custom URL**
- Is it set? (linkedin.com/in/firstname-lastname, not /in/firstname-lastname-a8b3c2d1)
- Does it match their name or brand?

**2i. Creator Mode & Settings (if personal profile)**
- Creator mode on/off — appropriate for their goal?
- Profile topics set and relevant?
- Newsletter feature enabled if thought leadership is a goal?
- Open to work / hiring badges appropriate?

**2j. Recommendations**
- Has any? Quality recommendations from recognizable people?
- Strategy for requesting them?

### Audit Output Format

Present the audit as a clear table:

| Element | Score | Status | Key Issue |
|---------|-------|--------|-----------|
| Headline | 4/10 | Needs work | Generic title, no value proposition |
| Photo | 8/10 | Good | Minor: background is distracting |
| Banner | 2/10 | Critical | Default LinkedIn banner — wasted space |
| ... | ... | ... | ... |

**Overall Profile Strength: X/100**

Then provide a prioritized action list: what to fix first for maximum impact.

## Step 3: Optimization Recommendations

For each element that scored below 7, provide:

1. **What's wrong** — Specific diagnosis, not vague feedback
2. **Why it matters** — How the LinkedIn algorithm or human psychology handles this
3. **Rewritten version** — The actual new text, ready to copy-paste
4. **Alternatives** — 2 variations so the user can pick what feels most "them"

### LinkedIn Algorithm Context (2024-2025 signals)

Use these when explaining WHY something matters:

- **Search ranking factors:** Headline keywords, about section keywords, skills, job titles, and location are all indexed. LinkedIn search is essentially keyword matching + connection proximity.
- **Profile views → connection requests pipeline:** Most people view profiles from search results or "People Also Viewed." Headline + photo are the only things visible in search results. They determine click-through.
- **About section "see more" cliff:** Only ~270 characters show by default. If the hook doesn't compel a click, the rest doesn't matter.
- **Featured section:** Appears above the activity feed. It's the highest-visibility content area you fully control.
- **SSI (Social Selling Index):** LinkedIn's internal score based on: establishing your brand, finding the right people, engaging with insights, building relationships. Profile completeness directly affects SSI.
- **All-Star profile status:** Profiles with photo, headline, about, experience, education, skills (5+), and location get up to 21x more profile views and 36x more messages.
- **Creator mode:** Enables the "Follow" button (vs. "Connect"), lets you set 5 profile topics, enables LinkedIn Live and newsletters. Best for thought leadership goals. Can reduce connection requests, so not ideal for business development.
- **Skills endorsements:** 50+ endorsements on a skill signal credibility to both the algorithm and profile viewers. Top 3 skills appear on your card in search results.
- **Profile photo impact:** Profiles with photos get 14x more views. Professional headshots with warm lighting and a simple background perform best.
- **Banner image:** No algorithmic impact, but massive psychological impact. It's the first thing the eye hits. A blank banner signals "I don't take LinkedIn seriously."

## Step 4: Deliver Optimized Content

Present all rewritten content in a clean, copy-paste-ready format:

```
HEADLINE (X/120 characters):
[new headline]

ABOUT SECTION (X/2,600 characters):
[new about section]

EXPERIENCE — [Role Title] at [Company]:
[new description]

FEATURED SECTION RECOMMENDATIONS:
- [what to pin and why]

SKILLS TO REORDER:
1. [primary skill]
2. [secondary skill]
3. [tertiary skill]

QUICK WINS:
- [ ] [action item]
- [ ] [action item]
```

After delivering, ask: "Which parts feel like you, and which feel off? I'll adjust."

## Step 5: Iteration

The user will likely push back on tone, phrasing, or positioning. This is expected and good — it means they're engaging with it honestly.

- When they say "this doesn't sound like me," ask them to point to the specific sentence and describe how they'd say it instead
- Use their rephrasing as calibration data and adjust the entire output to match
- Offer to rewrite individual sections independently
- Never defend AI-generated phrasing. If they don't like it, it's wrong. Period.

## Notes

- **Do NOT optimize posts, content strategy, or publishing cadence.** This skill is profile-only.
- **Do NOT recommend LinkedIn Premium, Sales Navigator, or paid features** unless the user specifically asks.
- **Do NOT fabricate achievements, metrics, or credentials.** Only work with what the user provides. If something would be stronger with a number, ask them for the real number.
- **Company pages have different rules than personal profiles.** Company pages can't use creator mode, have different character limits for the about section (2,000 chars), and the "voice" should be organizational, not personal.
- **Always search the web for the latest LinkedIn algorithm updates** before providing recommendations. The platform changes frequently.
- If the user provides a LinkedIn URL, use web search to pull whatever public information is available about the profile before starting the audit.
