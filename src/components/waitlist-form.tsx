'use client';

import { Mail } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface SubscribeFormProps {
  source: string;
  variant?: 'card' | 'inline';
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

function useSubscribe(source: string) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement | null)?.value?.trim();
    if (!email) return;

    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setMessage(data?.error || 'Could not subscribe. Please try again.');
        return;
      }

      setStatus('success');
      setMessage("You're in. Check your inbox.");
      form.reset();
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return { status, message, handleSubmit };
}

export function WaitlistForm({ source, variant = 'card' }: SubscribeFormProps) {
  const { status, message, handleSubmit } = useSubscribe(source);
  const submitting = status === 'submitting';
  const success = status === 'success';

  if (variant === 'inline') {
    return (
      <div className="mt-4 max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            disabled={submitting || success}
            placeholder="you@work.com"
            className="flex-1 px-4 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={submitting || success}
            className="inline-flex items-center justify-center px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors whitespace-nowrap disabled:opacity-60"
          >
            {success ? 'Subscribed' : submitting ? 'Subscribing...' : 'Subscribe free'}
          </button>
        </form>
        {message && (
          <p
            className={`mt-2 text-xs ${
              status === 'error' ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            {message}
          </p>
        )}
      </div>
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
        <div className="sm:w-auto w-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 sm:items-start"
          >
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              disabled={submitting || success}
              placeholder="you@work.com"
              className="px-4 py-2.5 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 sm:w-56 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={submitting || success}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {success ? 'Subscribed' : submitting ? 'Subscribing...' : 'Subscribe free'}
            </button>
          </form>
          {message && (
            <p
              className={`mt-2 text-xs ${
                status === 'error' ? 'text-destructive' : 'text-muted-foreground'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
