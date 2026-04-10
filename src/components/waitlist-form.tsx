'use client';

import { Mail } from 'lucide-react';

const BEEHIIV_SUBSCRIBE_URL = 'https://procureblog.beehiiv.com/?modal=signup';

interface SubscribeFormProps {
  source: string;
  variant?: 'card' | 'inline';
}

export function WaitlistForm({ source, variant = 'card' }: SubscribeFormProps) {
  if (variant === 'inline') {
    return (
      <form
        action={BEEHIIV_SUBSCRIBE_URL}
        method="POST"
        target="_blank"
        className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md"
      >
        <input type="hidden" name="utm_source" value={source} />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@work.com"
          className="flex-1 px-4 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors whitespace-nowrap"
        >
          Subscribe free
        </button>
      </form>
    );
  }

  return (
    <div className="md:col-span-3 bg-accent/5 border border-accent/20 rounded-lg p-6 mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-accent" />
            Get the newsletter
          </h4>
          <p className="text-[13px] text-muted-foreground">
            AI procurement news, funding rounds, and platform launches. Twice a week, straight to your inbox.
          </p>
        </div>
        <form
          action={BEEHIIV_SUBSCRIBE_URL}
          method="POST"
          target="_blank"
          className="flex flex-col sm:flex-row gap-2 sm:items-start sm:w-auto w-full"
        >
          <input type="hidden" name="utm_source" value={source} />
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@work.com"
            className="px-4 py-2.5 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 sm:w-56"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            Subscribe free
          </button>
        </form>
      </div>
    </div>
  );
}
