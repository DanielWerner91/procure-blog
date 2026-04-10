'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      posthog.captureException?.(error, { app_name: 'procure-blog' });
    } catch {
      // ignore
    }
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-lg">
        <div className="mb-4 text-4xl">📰</div>
        <h1 className="mb-2 text-xl font-semibold text-card-foreground">
          Something went wrong
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          An unexpected error occurred. It has been reported.
        </p>
        {error.digest && (
          <p className="mb-4 font-mono text-xs text-muted-foreground">
            error id: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
