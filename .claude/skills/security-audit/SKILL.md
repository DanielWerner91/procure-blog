---
name: security-audit
description: Run a comprehensive, non-developer-friendly security audit on any app or project. Use when someone asks for a security check, security review, audit, vulnerability scan, or mentions exposed secrets, API keys, tokens, or environment variables. Also use when someone says "is my app safe", "check for security issues", or "make sure nothing is exposed".
---

# Security Audit Skill

You are performing a thorough security audit for a non-developer who builds apps using Claude Code and modern web stacks (Next.js, Supabase, Vercel, n8n, etc.). They may have made security mistakes without knowing it. Your job is to find every problem, explain it simply, and fix it.

## Your Mindset

- Assume mistakes HAVE been made. Check everything, even if it looks fine at first glance.
- The user is not a developer. Never use jargon without immediately explaining it in plain English.
- Be exhaustive. A missed vulnerability is worse than a false alarm.
- Don't just flag problems — fix them or provide the exact steps to fix them.
- Treat this like a professional security firm was hired to protect a real product with real users.

---

## PHASE 1: Project Discovery

Before auditing anything, map the full project:

1. List all files and folders in the project root
2. Identify the tech stack (Next.js, Supabase, Vercel, n8n, APIs used, etc.)
3. Find ALL configuration files: `.env`, `.env.local`, `.env.production`, `.env.example`, `next.config.js`, `vercel.json`, `supabase/config.toml`, etc.
4. Find ALL files that might contain secrets: any file with "key", "secret", "token", "password", "auth", "config" in the name
5. Check `package.json` for all dependencies and note any that are outdated or known to have vulnerabilities
6. Check if there's a `.gitignore` file and what it contains

Report what you found before moving to Phase 2.

---

## PHASE 2: Secret & Credential Exposure Audit

This is the most critical section. A non-developer mistake can expose API keys to the entire internet.

### 2A — Secret Files Check

Search EVERY file for patterns matching secrets. Use Grep to scan for these patterns across the entire codebase:
- `sk-`, `pk_`, `secret_`, `api_key`, `apikey`, `token`, `password`
- `AUTH_`, `SERVICE_ROLE`, `ANON_KEY`, `PRIVATE_KEY`, `ACCESS_KEY`, `SECRET_KEY`, `WEBHOOK_SECRET`
- Any string that looks like a key (long alphanumeric strings, base64 blocks)

Check:
- Are any `.env` files missing from `.gitignore`?
- Are secrets hardcoded directly in source code (`.js`, `.ts`, `.jsx`, `.tsx`)?
- Are secrets in `next.config.js`, `vercel.json`, or other committed config files?

### 2B — Frontend Exposure Check

Find all files that run in the browser (anything in `/pages`, `/app`, `/components`, `/lib` that doesn't have `server` in the name or `"use server"` directive). Check:
- Do any reference environment variables NOT prefixed with `NEXT_PUBLIC_`?
- Do any `NEXT_PUBLIC_` variables contain secrets that should NOT be public? (e.g., `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` is dangerous)
- Are any API calls to external services made from frontend code with credentials embedded?

### 2C — Supabase-Specific (if Supabase is used)

- `SUPABASE_SERVICE_ROLE_KEY` must ONLY be used in server-side code, never in client/browser code
- `SUPABASE_ANON_KEY` is the only key safe for the frontend
- Check for exposed direct database connection strings

### 2D — Git History Warning

If `.git` folder exists, warn the user: secrets committed to git in the past remain in git history even if deleted from files. Recommend:
- Checking with: `git log --all --full-history -- "**/.env*"`
- Rotating any keys that may have ever been committed
- Consider using `git-secrets` for future protection

---

## PHASE 3: API & Backend Security Audit

### 3A — API Routes / Server Functions

Find all API routes (`/pages/api/`, `/app/api/`, server actions). For each route, check:
- **Authentication:** Does it verify the user is logged in before doing anything?
- **Authorization:** Does it verify the user has PERMISSION for the requested action?
- **Input validation:** Is user input validated before being used? Could someone send unexpected data?
- **Sensitive operations:** Are delete, update, or admin actions protected?
- **Data exposure:** Are there routes that return sensitive data without checking who's asking?

### 3B — Supabase Row Level Security (if applicable)

- Is RLS enabled? If not, ANY logged-in user can read/write ALL data.
- Is the service role key used in ways that bypass RLS?
- Recommend enabling RLS on all tables.

### 3C — Authentication Checks

- Identify the auth system (Supabase Auth, NextAuth, Clerk, custom, etc.)
- Are protected pages/routes verified server-side, not just client-side?
- Are there pages that should require login but don't?
- Is admin functionality protected?

### 3D — Webhook Security (if webhooks are used)

- Find webhook endpoints
- Do webhooks validate the signature/secret from the sender?
- Unsigned webhooks can be triggered by anyone on the internet

---

## PHASE 4: Data & User Safety Audit

### 4A — User Data Handling

- What user data is collected and stored?
- Are passwords ever stored in plain text? (They should NEVER be — use auth services)
- Is sensitive user data logged anywhere (console.log with emails, tokens, etc.)?
- Is user data sent to third-party services unnecessarily?

### 4B — Input Validation & Injection Risks

- Are user inputs used directly in database queries? (SQL injection risk)
- Are user inputs rendered directly as HTML? (XSS risk — lets attackers run code)
- Are file uploads validated for file type and size?

### 4C — Third-Party Dependencies

Check `package.json` for:
- Severely outdated packages (major versions behind)
- Known critical vulnerabilities
- Suspicious or unfamiliar packages (typosquatting risk)
- Recommend running `npm audit` and explain what it does

---

## PHASE 5: Infrastructure & Deployment Security

### 5A — Environment Configuration

- Are all secret environment variables set in the deployment platform (Vercel dashboard) and NOT in committed files?
- Check `vercel.json` for exposed configuration
- Are dev and production `.env` files handled correctly?

### 5B — CORS and Domain Configuration

- Is CORS configured? Is it too permissive (allowing `*` means anyone can call your API)?
- Are there hardcoded localhost URLs that would break in production or expose dev infrastructure?

### 5C — Error Handling

- Do error messages expose internal details (stack traces, file paths, database errors)?
- Errors shown to users should be generic; detailed errors should only go to logs.

### 5D — Rate Limiting

- Do API routes that could be abused (login, signup, contact forms, AI calls) have rate limiting?
- Without rate limiting, someone could spam your endpoints and rack up costs.

---

## PHASE 6: Final Report

Produce a clear, non-technical report with these sections:

### Format

```
### CRITICAL — Fix Immediately
[Issues that could expose secrets, user data, or allow unauthorized access RIGHT NOW]

### HIGH — Fix Before Launch / Fix Soon
[Serious vulnerabilities that create real risk]

### MEDIUM — Should Fix
[Issues that create risk or represent bad practices]

### LOW / Best Practices
[Improvements that would make the app more secure and professional]

### What's Working Well
[Acknowledge what IS properly secured]
```

### Report Writing Rules

- Write every finding in plain English. No jargon without explanation.
- For every problem, provide:
  1. What the problem is (in simple terms)
  2. Why it's dangerous (what could go wrong)
  3. Exactly how to fix it (specific file, specific change, or command)
- Never say "consider" or "you might want to" for critical/high issues — say "you must fix this"
- If you can fix something directly in the code, DO IT and tell the user what you changed
- End with: "Your app is [safe to use / not yet safe to use] because [reason]. Here are the X things to fix before going live."

---

## Execution Strategy

Use parallel Agent calls where possible to speed up the audit:
- Launch one agent to scan for secret patterns (Phase 2A-2C)
- Launch another to map API routes and check auth (Phase 3A-3C)
- Launch another to check dependencies and infrastructure (Phase 4C, 5A-5D)

Consolidate all findings into the final report yourself in the main context.
