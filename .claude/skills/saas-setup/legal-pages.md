# Legal Pages Reference -- Termly Integration

---

## Privacy Policy Page

**File (App Router):** `src/app/privacy/page.tsx`

```tsx
export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  const termlyUuid = process.env.NEXT_PUBLIC_TERMLY_WEBSITE_UUID;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div
        name="termly-embed"
        data-id={termlyUuid}
        data-type="iframe"
      />
      <script
        src="https://app.termly.io/embed-policy.min.js"
        async
      />
    </div>
  );
}
```

---

## Terms of Service Page

**File (App Router):** `src/app/terms/page.tsx`

```tsx
export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  const termlyUuid = process.env.NEXT_PUBLIC_TERMLY_WEBSITE_UUID;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div
        name="termly-embed"
        data-id={termlyUuid}
        data-type="iframe"
      />
      <script
        src="https://app.termly.io/embed-policy.min.js"
        async
      />
    </div>
  );
}
```

**Note:** Termly uses the same embed code for both pages -- it detects the page URL and shows the correct policy. Make sure both `/privacy` and `/terms` URLs are configured in your Termly dashboard.

---

## Termly Client Component (Alternative)

If the `<script>` tag in a Server Component causes hydration issues, use a client component wrapper instead:

**File:** `src/components/termly-embed.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";

interface TermlyEmbedProps {
  policyType: "privacy" | "terms";
}

export function TermlyEmbed({ policyType }: TermlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termlyUuid = process.env.NEXT_PUBLIC_TERMLY_WEBSITE_UUID;

  useEffect(() => {
    if (!containerRef.current || !termlyUuid) return;

    // Create the embed div
    const embedDiv = document.createElement("div");
    embedDiv.setAttribute("name", "termly-embed");
    embedDiv.setAttribute("data-id", termlyUuid);
    embedDiv.setAttribute("data-type", "iframe");
    containerRef.current.appendChild(embedDiv);

    // Load the Termly script
    const script = document.createElement("script");
    script.src = "https://app.termly.io/embed-policy.min.js";
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [termlyUuid]);

  return <div ref={containerRef} className="min-h-[600px]" />;
}
```

Then use in pages:
```tsx
import { TermlyEmbed } from "@/components/termly-embed";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <TermlyEmbed policyType="privacy" />
    </div>
  );
}
```

---

## Footer Links

Add to the root layout's footer section:

```tsx
<footer className="border-t py-6">
  <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 text-sm text-muted-foreground">
    <a href="/privacy" className="hover:text-foreground transition-colors">
      Privacy Policy
    </a>
    <a href="/terms" className="hover:text-foreground transition-colors">
      Terms of Service
    </a>
  </div>
</footer>
```

---

## Pages Router Adaptations

For Pages Router:

**Privacy:** `src/pages/privacy.tsx`
**Terms:** `src/pages/terms.tsx`

Use the client component approach (`TermlyEmbed`) since Pages Router pages are client-rendered by default.

Add footer links to `src/pages/_app.tsx` or a shared layout component.
