---
name: saas-setup
description: "Set up SaaS infrastructure for Next.js + Supabase + Vercel apps. Google OAuth, Lemon Squeezy payments, subscription gating, legal pages, RLS policies, webhook security. Use when setting up auth, payments, subscriptions, billing, legal pages, or SaaS features for an n8n webapp."
---

# SaaS Setup -- Auth, Payments & Subscriptions Pipeline

Adds production SaaS infrastructure to a Next.js + Supabase + Vercel app: authentication (Google OAuth), payments via Lemon Squeezy, subscription gating, legal pages, and a locked-down Supabase schema with RLS.

## When This Skill Activates

Use when the user requests any of:
- Setting up authentication / Google login
- Adding payments, subscriptions, or billing (Lemon Squeezy)
- Adding legal pages (privacy policy, terms of service)
- "Set up SaaS", "add auth and payments", "make this a paid app"
- Any request to add subscription infrastructure to a project in ~/n8n-apps/

---

## Phase 0: Pre-flight Checks

Before writing ANY code, do these checks:

### Step 1: Detect Router Type

```bash
# Check for App Router (src/app/) vs Pages Router (src/pages/)
ls src/app/layout.tsx 2>/dev/null && echo "APP_ROUTER" || echo "PAGES_ROUTER"
```

Store the result. ALL file paths in this skill adapt based on router type:
- **App Router:** `src/app/`, server components, `middleware.ts` at project root
- **Pages Router:** `src/pages/`, `_app.tsx`, `middleware.ts` at project root

If neither exists, ask the user which router they're using.

### Step 2: Confirm External Accounts

Ask the user (via AskUserQuestion) to confirm they have these ready:

1. **Google Cloud Console** -- OAuth 2.0 client ID + secret created, authorized redirect URI set to `https://<project-ref>.supabase.co/auth/v1/callback`
2. **Lemon Squeezy** -- Account created, store set up, at least one product/variant created, API key generated
3. **Termly** -- Account created, policies generated, Website UUID available
4. **Supabase** -- Project created, service role key and anon key available

Also ask:
- "What is your Lemon Squeezy product variant ID for the Pro plan?"

### Step 3: Check Existing Setup

Before generating, check what already exists to avoid overwriting:
```bash
# Check for existing auth setup
ls src/lib/supabase/ 2>/dev/null
ls src/app/auth/ 2>/dev/null || ls src/pages/auth/ 2>/dev/null
# Check for existing payment setup
ls src/app/api/webhooks/ 2>/dev/null || ls src/pages/api/webhooks/ 2>/dev/null
# Check for existing middleware
ls middleware.ts 2>/dev/null
```

If files exist, ask the user whether to overwrite or skip each section.

---

## Phase 1: Supabase Schema

Generate the SQL and present it to the user to run in the Supabase SQL Editor. Do NOT run this automatically.

Reference: [schema.sql](schema.sql) for the complete SQL.

The schema includes:
- `profiles` table with subscription fields
- `webhook_events` table for idempotency
- RLS policies scoped to `auth.uid()`
- Trigger to auto-create profile on signup
- Service-role-only access for webhook_events

**Output:** Print the SQL and instruct the user to run it in Supabase Dashboard > SQL Editor.

---

## Phase 2: Authentication

Set up Supabase Auth with Google OAuth.

### Step 1: Install dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Step 2: Create Supabase clients

Reference: [supabase-auth.md](supabase-auth.md) for complete client code.

Generate these files:
- `src/lib/supabase/client.ts` -- Browser client (uses anon key)
- `src/lib/supabase/server.ts` -- Server client (uses anon key + cookie handling)
- `src/lib/supabase/middleware.ts` -- Session refresh logic
- `middleware.ts` (project root) -- Imports and runs the middleware helper

### Step 3: Auth callback route

- **App Router:** `src/app/auth/callback/route.ts`
- **Pages Router:** `src/pages/api/auth/callback.ts`

Exchanges the OAuth code for a session.

### Step 4: Sign-in UI

Create a sign-in component/page with Google button.
- **App Router:** `src/app/login/page.tsx` + `src/components/auth/login-form.tsx`
- **Pages Router:** `src/pages/login.tsx`

---

## Phase 3: Payments & Subscriptions (Lemon Squeezy)

Reference: [lemonsqueezy.md](lemonsqueezy.md) for complete implementation code.

### Step 1: Checkout endpoint

- **App Router:** `src/app/api/checkout/route.ts`
- **Pages Router:** `src/pages/api/checkout.ts`

Creates a Lemon Squeezy checkout session. Requires authenticated user. Passes user ID and email as custom data.

### Step 2: Billing portal endpoint

- **App Router:** `src/app/api/billing/route.ts`
- **Pages Router:** `src/pages/api/billing.ts`

Redirects authenticated user to Lemon Squeezy customer portal.

### Step 3: Webhook handler

- **App Router:** `src/app/api/webhooks/lemonsqueezy/route.ts`
- **Pages Router:** `src/pages/api/webhooks/lemonsqueezy.ts`

**Non-negotiable security requirements:**
1. Verify `X-Signature` header using HMAC-SHA256 with `LEMONSQUEEZY_WEBHOOK_SECRET` BEFORE any processing
2. Check `webhook_events` table for duplicate event IDs (idempotency)
3. Use Supabase service role client (server-side only)
4. Handle events: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired`
5. Update `profiles.subscription_status` accordingly

### Step 4: Client-side subscription hook

Create `src/hooks/use-subscription.ts`:
- Fetches the current user's profile
- Returns `{ subscription, isProUser, isLoading }`
- Caches with appropriate stale time

### Step 5: Feature gating components

Create `src/components/pro-only.tsx`:
- `<ProOnly>` wrapper -- renders children only if user is pro, shows upgrade prompt otherwise
- `<ProBadge>` -- visual indicator for pro features

### Step 6: Server-side subscription check

Create `src/lib/check-subscription.ts`:
- `requirePro(supabaseClient)` -- throws 403 if user is not pro
- Use in any API route that needs subscription gating

---

## Phase 4: Legal Pages

Reference: [legal-pages.md](legal-pages.md) for complete implementation.

### Step 1: Create privacy and terms pages

- **App Router:** `src/app/privacy/page.tsx` and `src/app/terms/page.tsx`
- **Pages Router:** `src/pages/privacy.tsx` and `src/pages/terms.tsx`

Both pages embed Termly policies using `NEXT_PUBLIC_TERMLY_WEBSITE_UUID`.

### Step 2: Footer links

Add Privacy Policy and Terms of Service links to the root layout footer.

---

## Phase 5: Environment Variables

### Generate .env.example

Create `.env.example` with ALL required variables (placeholder values only):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=your-api-key
LEMONSQUEEZY_STORE_ID=your-store-id
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret
LEMONSQUEEZY_VARIANT_ID=your-variant-id

# Termly
NEXT_PUBLIC_TERMLY_WEBSITE_UUID=your-termly-uuid

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Verify .gitignore

Ensure `.env.local` is in `.gitignore`. If not, add it.

---

## Phase 6: Security Verification

Reference: [security-checklist.md](security-checklist.md) for the full checklist.

Run these automated checks after all code is generated:

### Check 1: Service role key never in client code
```bash
grep -r "SUPABASE_SERVICE_ROLE_KEY" src/components/ src/app/**/page.tsx src/hooks/ 2>/dev/null
```
This MUST return empty. If it finds matches, fix immediately.

### Check 2: Webhook signature verification exists
```bash
grep -n "X-Signature\|createHmac\|timingSafeEqual" src/app/api/webhooks/lemonsqueezy/route.ts 2>/dev/null
```
Must find HMAC verification code.

### Check 3: All API routes check authentication
```bash
grep -L "getUser\|auth\|401" src/app/api/*/route.ts 2>/dev/null
```
Any file listed here is missing auth checks.

### Check 4: .env.local is gitignored
```bash
grep ".env.local" .gitignore
```

Report results to the user. If any check fails, fix before proceeding.

---

## Phase 7: Manual Steps Checklist

After all code is generated, present this checklist to the user:

```markdown
## Manual Steps Required

### Supabase
- [ ] Run the SQL schema in Supabase Dashboard > SQL Editor
- [ ] Enable Google provider in Authentication > Providers
- [ ] Set Google OAuth Client ID and Secret
- [ ] Add your production URL to Authentication > URL Configuration > Redirect URLs

### Lemon Squeezy
- [ ] Create a webhook in Lemon Squeezy Dashboard pointing to:
      `https://your-domain.com/api/webhooks/lemonsqueezy`
- [ ] Select events: subscription_created, subscription_updated,
      subscription_cancelled, subscription_expired
- [ ] Copy the webhook signing secret to LEMONSQUEEZY_WEBHOOK_SECRET

### Vercel
- [ ] Add ALL environment variables from .env.example to Vercel project settings
- [ ] Redeploy after adding env vars

### Google Cloud Console
- [ ] Add your production Supabase callback URL as authorized redirect URI:
      `https://<project-ref>.supabase.co/auth/v1/callback`
- [ ] Add your production domain to authorized JavaScript origins

### Termly
- [ ] Copy your Website UUID to NEXT_PUBLIC_TERMLY_WEBSITE_UUID

### Testing
- [ ] Test Google sign-in flow end-to-end
- [ ] Test checkout flow (use Lemon Squeezy test mode)
- [ ] Verify webhook receives events and updates subscription_status
- [ ] Verify <ProOnly> gating works for free vs pro users
- [ ] Verify privacy and terms pages load correctly
```

---

## Notes

- **Security is non-negotiable.** Never skip webhook verification, never expose service role keys client-side, always check auth in API routes.
- **All Lemon Squeezy calls are server-side only.** The API key and webhook secret never touch the browser.
- **The webhook_events table prevents duplicate processing.** Always check before processing.
- **Subscription status lives in the profiles table.** The webhook updates it; the client reads it.
- **Server-side is the source of truth.** `useSubscription()` is for UI convenience. API routes must independently verify subscription status.
- Keep SKILL.md as the orchestration guide. All implementation code lives in the reference files.
