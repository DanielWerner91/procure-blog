---
name: linkedin-commenter
description: Automate LinkedIn commenting via Playwright MCP. Opens Content Flywheel engagement hub, filters by brand/platform, switches LinkedIn identity, types AI-generated comments, posts them, and marks as completed. Use when asked to "comment on LinkedIn", "do engagement", "post comments", "engage on LinkedIn", "run engagement session", or similar.
---

# LinkedIn Commenter (Playwright Automation)

Automates the LinkedIn commenting workflow end-to-end using Playwright MCP browser automation and the Content Flywheel engagement hub.

## When This Skill Activates

Trigger phrases:
- "comment on LinkedIn posts"
- "do engagement" / "run engagement"
- "post comments on LinkedIn"
- "start commenting"
- "engage on LinkedIn"

## Step 0: Pre-Flight Questions

ALWAYS ask these before starting. Never assume defaults:

1. **Which brand/account?** (AI Insights Hub, Procure.Blog, Content Flywheel, Daniel Werner personal)
2. **How many comments?** (default: 5, max recommended: 10 per session — see daily limits below)
3. **Minimum relevance score?** (default: 6/10, recommend 7+ for quality)
4. **Skip already-commented posts?** (default: yes)

## Step 1: LinkedIn Strategy Alignment Check

Before commenting, verify alignment with the LinkedIn Growth Playbook:

- **Daily comment budget:** 10-20 substantive comments total per day across all sessions
- **Comment timing:** Best within first 30-60 min of target posts for max exposure
- **Target accounts:** Prioritize creators with 5K-50K followers in niche
- **Pre-post warmup:** If the user plans to publish a post soon, commenting BEFORE posting gives +20% reach
- **Comment quality:** Every comment must add value — new data, specific insight, respectful counter-angle
- **Max per post:** Never more than 1 comment per post per brand (looks automated if more)

**Comment quality rules (enforced by engagement-scorer.ts):**
- NEVER: "Great post!", "So true!", "This resonates", "Couldn't agree more", "This is spot on"
- NEVER: Start with "This is..." or "What a..."
- NEVER: Use dashes/em dashes, corporate buzzwords (leverage, synergy, ecosystem)
- DO: Add a fact, stat, or related development
- DO: Share a concrete opinion or contrarian angle
- News-editorial style (AI Insights Hub): factual, third-person, 1-2 sentences, citing data

## Step 2: Browser Setup

### Launch Playwright
```
Use mcp__playwright__browser_navigate to open https://content-flywheel.com/engagement
```

### Known Issues & Workarounds

**Chrome already running:**
- Playwright (Chromium) cannot launch if Chrome is already open
- Ask the user to close Chrome first, then retry
- Save this to memory if it happens so we can warn proactively next time

**Page shows wrong URL after tab switch:**
- LinkedIn tabs sometimes show Content Flywheel URL in page metadata
- This is a Playwright quirk — the content is correct, trust the tab title
- Always use snapshots to verify actual page content

**Snapshot too large:**
- Save snapshots to files using the `filename` parameter
- Use `grep` on the saved file to find specific refs (identity switcher, comment box, buttons)
- Search patterns: "switching identity", "Text editor", "Add a comment", "Copy Comment", "Commented"

## Step 3: Filter Engagement Hub

On the Content Flywheel engagement page:
1. **Set brand filter** to the selected brand (dropdown/select)
2. **Set platform filter** to "linkedin" (or "all" and manually skip non-LinkedIn)
3. **Set sort** to "relevance" (highest-scored posts first)
4. Posts are displayed in order — work top to bottom

## Step 4: The Comment Loop

For each post (repeat N times as requested):

### 4a. Copy Comment
- Click "Copy Comment" button on the post card in Content Flywheel
- This copies the AI-generated comment to clipboard
- Note: The comment text is also visible in the textbox on the card — read it for reference

### 4b. Open on LinkedIn
- Click "Open on LinkedIn" button — opens post in a new tab
- Switch to the new LinkedIn tab

### 4c. Switch Identity
- Take a snapshot of the LinkedIn post page
- Find the button: `"Open menu for switching identity when interacting with this post"`
- Click it to open the identity dialog
- Select the correct brand radio button (e.g., "AI Insights Hub")
- Click "Save selection"
- Verify the comment box now says "Comment as [Brand Name]..."

**CRITICAL: Identity refs change per page.** Never reuse ref IDs from a previous tab. Always take a fresh snapshot on each new LinkedIn post to find the correct identity switcher button.

### 4d. Type Comment
- Click the comment textbox (`"Text editor for creating content"`)
- Type the comment using `slowly: true` — LinkedIn's Quill editor requires character-by-character input
- Verify the text appears correctly in the textbox

### 4e. Post Comment
- Click the "Comment" button that appears below the textbox after typing
- Verify the comment appears in the comments section with the brand name and timestamp "now"

### 4f. Mark as Completed
- Switch back to Content Flywheel tab (tab 0)
- Click the "Commented" button on the corresponding post card
- Verify the toast: "Marked as commented"
- The post disappears from the list

### 4g. Move to Next
- The list automatically shifts — the next post is now first
- Repeat from 4a

## Step 5: Session Summary

After completing all comments, provide a summary table:

| # | Post Author | Topic | Score | Status |
|---|---|---|---|---|
| 1 | ... | ... | 7/10 | Commented |
| 2 | ... | ... | 7/10 | Already commented, marked |
| ... | | | | |

Include:
- Total comments posted this session
- Total marked as already-commented (skipped)
- Remaining suggested posts in queue
- Any errors or skipped posts

## Error Recovery

### Wrong element clicked (navigation to wrong page)
1. Close the accidentally opened tab
2. Go back to the LinkedIn post tab
3. Take a fresh snapshot
4. Find the correct element ref
5. Continue the workflow

### Comment already exists from brand on post
- If the brand already has a comment on the LinkedIn post, do NOT double-comment
- Go back to Content Flywheel, mark as "Commented", and move to next post

### LinkedIn rate limiting / captcha
- Stop immediately
- Report to user
- Save incident to memory for future reference
- Recommend waiting 30-60 minutes before resuming

### Identity switcher not found
- The post may not support page commenting (rare)
- Try scrolling down or clicking "Comment" button first to expand the comment area
- If still not found, skip the post and mark as "Skip" in Content Flywheel

## Self-Improvement Protocol

After each session, save learnings to memory at `~/.claude/memory/linkedin-commenter/`:

**What to save:**
- New error patterns and their solutions
- Timing of successful sessions (for optimal scheduling)
- Posts that were already commented (pattern: did a previous cron do this?)
- UI changes in LinkedIn or Content Flywheel that broke selectors
- Any rate limiting incidents

**What NOT to save:**
- Individual post details or comment text (ephemeral)
- Ref IDs (change every page load)

**Memory files:**
- `lessons.md` — Accumulated operational lessons and workarounds
- `session-log.md` — Brief log of sessions (date, brand, count, issues)

## Content Flywheel Engagement Hub Reference

**URL:** https://content-flywheel.com/engagement

**Post card structure:**
- Author name + platform badge
- Relevance score (X/10)
- Post text preview
- AI-suggested comment (editable textbox)
- Action buttons: Copy Comment | Open on LinkedIn | Commented | Skip

**Filters:**
- Brand selector (dropdown by brand ID)
- Platform selector (all/linkedin/bluesky/twitter/etc)
- Sort selector (relevance/date)

**Stats cards at top:**
- Discovered today
- Actions taken
- Comments received
- Pending review

## LinkedIn Page Structure Reference

**Key elements to find via snapshot grep:**
- Identity switcher: `"Open menu for switching identity"`
- Comment textbox: `"Text editor for creating content"`
- Comment submit: `"Comment"` button (appears after typing)
- Identity dialog: `"Comment, react, and repost as"` dialog with radio buttons
- Save button: `"Save selection"` in identity dialog

## Integration with LinkedIn Strategy Skill

This skill MUST respect all rules from `/linkedin-strategy`:
- Comments follow news-editorial style for news brands (AI Insights Hub, Procure.Blog)
- Comments follow conversational style for personal brands
- No hashtags in comments (not that they'd typically appear, but enforce)
- No engagement bait language in comments
- Daily comment budget: 10-20 total (track across sessions)
- Pre-post warmup: if user mentions they're about to publish, suggest commenting first
