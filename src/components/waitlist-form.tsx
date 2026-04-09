'use client';

import { useState, FormEvent } from 'react';
import { Mail, Check } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface WaitlistFormProps {
  source: string;
  variant?: 'card' | 'inline';
}

export function WaitlistForm({ source, variant = 'card' }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage(data.already ? "You're already on the list." : "You're on the list. We'll be in touch.");
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div
        className={
          variant === 'card'
            ? 'md:col-span-3 bg-accent/5 border border-accent/20 rounded-lg p-6 mb-2 flex items-center gap-3'
            : 'mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 text-accent text-sm font-medium rounded-md'
        }
      >
        <Check className="h-4 w-4 text-accent" />
        <span className="text-sm text-foreground">{message}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@work.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className="flex-1 px-4 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {status === 'loading' ? 'Joining…' : 'Join the waitlist'}
        </button>
        {status === 'error' && (
          <p className="text-xs text-red-500 sm:w-full">{message}</p>
        )}
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
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:items-start sm:w-auto w-full">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@work.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="px-4 py-2.5 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 disabled:opacity-60 sm:w-56"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {status === 'loading' ? 'Joining…' : 'Join the waitlist'}
          </button>
        </form>
      </div>
      {status === 'error' && (
        <p className="mt-3 text-xs text-red-500">{message}</p>
      )}
    </div>
  );
}
