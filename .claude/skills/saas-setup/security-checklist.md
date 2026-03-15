# Security Checklist

Run these checks after generating all SaaS setup code. Every check must pass.

---

## Automated Checks

### Check 1: Service Role Key Not in Client Code

```bash
# Must return EMPTY -- any match is a critical security violation
grep -rn "SUPABASE_SERVICE_ROLE_KEY" \
  src/components/ \
  src/hooks/ \
  src/app/**/page.tsx \
  src/app/**/layout.tsx \
  2>/dev/null
```

**If it fails:** The service role key bypasses ALL RLS. It must ONLY appear in:
- `src/lib/supabase/service.ts`
- `src/app/api/webhooks/*/route.ts`

Never import `createServiceClient` in any client component, page, or hook.

---

### Check 2: Webhook Signature Verification Exists

```bash
# Must find HMAC verification code
grep -n "createHmac\|timingSafeEqual\|X-Signature" \
  src/app/api/webhooks/lemonsqueezy/route.ts \
  2>/dev/null
```

**Expected:** At least 3 matches (createHmac, timingSafeEqual, X-Signature).

**If it fails:** The webhook handler is processing unverified payloads. Anyone could fake a webhook call and grant themselves a pro subscription.

---

### Check 3: All API Routes Check Authentication

```bash
# List API routes missing auth checks
grep -rL "getUser\|auth\.\|401" src/app/api/*/route.ts 2>/dev/null
```

**Expected:** Only the webhook route should appear (webhooks authenticate via signature, not user session).

**If other routes appear:** They're missing authentication. Every non-webhook API route must call `supabase.auth.getUser()` and return 401 if no user.

---

### Check 4: .env.local in .gitignore

```bash
grep -n ".env.local" .gitignore
```

**Expected:** At least one match.

**If it fails:** Add `.env.local` to `.gitignore` immediately. The file contains secrets.

---

### Check 5: .env.example Has No Real Values

```bash
# Check for anything that looks like a real key (long alphanumeric strings)
grep -E "[a-zA-Z0-9]{32,}" .env.example 2>/dev/null
```

**Expected:** No matches. All values should be placeholders like `your-anon-key`.

---

### Check 6: No Hardcoded Webhook URLs or API Keys

```bash
grep -rn "lemonsqueezy.com" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules"
```

**Expected:** Only in API route files (`src/app/api/`), never in components or pages.

---

### Check 7: Lemon Squeezy API Key Not in Client Code

```bash
grep -rn "LEMONSQUEEZY_API_KEY\|LEMONSQUEEZY_WEBHOOK_SECRET" \
  src/components/ \
  src/hooks/ \
  src/app/**/page.tsx \
  2>/dev/null
```

**Expected:** Empty. These are server-only secrets.

---

## Manual Review Checklist

After automated checks pass, verify these by reading the code:

- [ ] `createServiceClient()` is only called in webhook handlers
- [ ] The webhook handler parses raw body text (not JSON) before signature verification
- [ ] `timingSafeEqual` is used (not `===`) for signature comparison to prevent timing attacks
- [ ] The webhook handler checks `webhook_events` for duplicates BEFORE processing
- [ ] The `webhook_events` insert happens BEFORE the subscription update
- [ ] All `fetch` calls to Lemon Squeezy API happen in API routes, not components
- [ ] The checkout endpoint includes `user_id` in custom data so the webhook can link back
- [ ] The `useSubscription` hook reads from the database, not from a JWT claim
- [ ] Server-side `requirePro` checks the database independently (doesn't trust client state)

---

## Common Security Mistakes to Prevent

| Mistake | Why It's Dangerous | Prevention |
|---|---|---|
| Service role key in client bundle | Bypasses all RLS, full DB access | Only import in `/api/` or `/lib/supabase/service.ts` |
| Missing webhook signature check | Anyone can fake subscription events | Always verify X-Signature with HMAC-SHA256 |
| Using `===` for signature comparison | Timing attack reveals valid signatures | Always use `crypto.timingSafeEqual` |
| No idempotency check | Duplicate webhooks create duplicate subscriptions | Check webhook_events table before processing |
| Trusting client subscription status | Users can modify client state | Server-side check in every pro-gated API route |
| Hardcoded API keys | Keys in git history forever | Use .env.local + .env.example pattern |
| NEXT_PUBLIC_ prefix on secrets | Exposed in client bundle | Only NEXT_PUBLIC_ for non-secret values |
