# Lemon Squeezy Reference -- Payments & Subscriptions

Complete implementation for Lemon Squeezy checkout, billing portal, webhook handler, subscription hook, and feature gating.

---

## Checkout Endpoint

**File (App Router):** `src/app/api/checkout/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              user_id: user.id,
            },
            email: user.email,
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMONSQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: process.env.LEMONSQUEEZY_VARIANT_ID,
            },
          },
        },
      },
    }),
  });

  const checkout = await response.json();

  if (!response.ok) {
    console.error("Lemon Squeezy checkout error:", checkout);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    url: checkout.data.attributes.url,
  });
}
```

---

## Billing Portal Endpoint

**File (App Router):** `src/app/api/billing/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the user's Lemon Squeezy customer ID from their profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("lemonsqueezy_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.lemonsqueezy_customer_id) {
    return NextResponse.json(
      { error: "No subscription found" },
      { status: 404 }
    );
  }

  // Get customer portal URL from Lemon Squeezy
  const response = await fetch(
    `https://api.lemonsqueezy.com/v1/customers/${profile.lemonsqueezy_customer_id}`,
    {
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
    }
  );

  const customer = await response.json();

  if (!response.ok) {
    console.error("Lemon Squeezy customer error:", customer);
    return NextResponse.json(
      { error: "Failed to get billing portal" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    url: customer.data.attributes.urls.customer_portal,
  });
}
```

---

## Webhook Handler

**File (App Router):** `src/app/api/webhooks/lemonsqueezy/route.ts`

```typescript
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/service";

// Disable body parsing -- we need the raw body for signature verification
export const dynamic = "force-dynamic";

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("X-Signature");

  // SECURITY: Verify webhook signature FIRST
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const isValid = verifyWebhookSignature(
    body,
    signature,
    process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
  );

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const eventName = event.meta.event_name as string;
  const eventId = event.meta.webhook_id as string;

  // SECURITY: Use service role client for webhook processing
  const supabase = createServiceClient();

  // IDEMPOTENCY: Check if we've already processed this event
  const { data: existingEvent } = await supabase
    .from("webhook_events")
    .select("id")
    .eq("event_id", eventId)
    .single();

  if (existingEvent) {
    // Already processed -- return 200 to prevent retry
    return NextResponse.json({ message: "Already processed" });
  }

  // Record the event before processing
  await supabase.from("webhook_events").insert({
    event_id: eventId,
    event_name: eventName,
    payload: event,
    processed_at: new Date().toISOString(),
  });

  // Extract subscription data
  const attributes = event.data.attributes;
  const userId = event.meta.custom_data?.user_id;

  if (!userId) {
    console.error("Webhook missing user_id in custom_data:", eventId);
    return NextResponse.json({ message: "No user_id" });
  }

  // Handle subscription events
  switch (eventName) {
    case "subscription_created": {
      await supabase
        .from("profiles")
        .update({
          subscription_status: "pro",
          lemonsqueezy_customer_id: String(attributes.customer_id),
          lemonsqueezy_subscription_id: String(event.data.id),
          subscription_ends_at: attributes.ends_at,
        })
        .eq("id", userId);
      break;
    }

    case "subscription_updated": {
      const status = attributes.status;
      // Map Lemon Squeezy statuses to our simplified model
      const subscriptionStatus =
        status === "active" || status === "on_trial" ? "pro" : "free";

      await supabase
        .from("profiles")
        .update({
          subscription_status: subscriptionStatus,
          subscription_ends_at: attributes.ends_at,
        })
        .eq("id", userId);
      break;
    }

    case "subscription_cancelled": {
      // Keep pro access until ends_at, but mark as cancelled
      await supabase
        .from("profiles")
        .update({
          subscription_ends_at: attributes.ends_at,
          // They keep "pro" until ends_at -- a cron or check handles expiry
        })
        .eq("id", userId);
      break;
    }

    case "subscription_expired": {
      await supabase
        .from("profiles")
        .update({
          subscription_status: "free",
          lemonsqueezy_subscription_id: null,
          subscription_ends_at: null,
        })
        .eq("id", userId);
      break;
    }

    default:
      console.log(`Unhandled Lemon Squeezy event: ${eventName}`);
  }

  return NextResponse.json({ message: "OK" });
}
```

---

## Subscription Hook

**File:** `src/hooks/use-subscription.ts`

```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SubscriptionData {
  subscription_status: "free" | "pro";
  subscription_ends_at: string | null;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchSubscription() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("subscription_status, subscription_ends_at")
        .eq("id", user.id)
        .single();

      setSubscription(data);
      setIsLoading(false);
    }

    fetchSubscription();
  }, []);

  const isProUser =
    subscription?.subscription_status === "pro" &&
    (!subscription.subscription_ends_at ||
      new Date(subscription.subscription_ends_at) > new Date());

  return { subscription, isProUser, isLoading };
}
```

---

## ProOnly Component

**File:** `src/components/pro-only.tsx`

```tsx
"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { ReactNode } from "react";

interface ProOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProOnly({ children, fallback }: ProOnlyProps) {
  const { isProUser, isLoading } = useSubscription();

  if (isLoading) return null;

  if (!isProUser) {
    return (
      fallback ?? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            This feature requires a Pro subscription.
          </p>
          <button
            onClick={async () => {
              const res = await fetch("/api/checkout", { method: "POST" });
              const { url } = await res.json();
              if (url) window.location.href = url;
            }}
            className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Upgrade to Pro
          </button>
        </div>
      )
    );
  }

  return <>{children}</>;
}

export function ProBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-purple-600 px-2 py-0.5 text-xs font-medium text-white">
      PRO
    </span>
  );
}
```

---

## Server-Side Subscription Check

**File:** `src/lib/check-subscription.ts`

```typescript
import { SupabaseClient } from "@supabase/supabase-js";

export async function requirePro(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, subscription_ends_at")
    .eq("id", user.id)
    .single();

  const isPro =
    profile?.subscription_status === "pro" &&
    (!profile.subscription_ends_at ||
      new Date(profile.subscription_ends_at) > new Date());

  if (!isPro) {
    throw new Response(JSON.stringify({ error: "Pro subscription required" }), {
      status: 403,
    });
  }

  return { user, profile };
}
```

**Usage in API routes:**

```typescript
import { createClient } from "@/lib/supabase/server";
import { requirePro } from "@/lib/check-subscription";

export async function POST() {
  const supabase = await createClient();

  try {
    const { user } = await requirePro(supabase);
    // ... pro-only logic
  } catch (response) {
    return response as Response;
  }
}
```

---

## Pages Router Adaptations

For Pages Router, adapt the API routes:

**Checkout:** `src/pages/api/checkout.ts`
```typescript
import type { NextApiRequest, NextApiResponse } from "next";
// Use createPagesServerClient or equivalent to get supabase + user
```

**Webhook:** `src/pages/api/webhooks/lemonsqueezy.ts`
```typescript
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: { bodyParser: false }, // Need raw body for signature
};

// Read raw body: const body = await getRawBody(req);
```

The logic is identical -- only the Next.js API patterns differ.
