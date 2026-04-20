'use client';

import { useMemo, useState } from 'react';
import type { IndexObservation } from '@/lib/pseo/index-fetch';
import { trackEngage } from './tracker';

interface Props {
  observations: IndexObservation[];
  unit: string;
  sourceLabel: string;
  sourceUrl?: string;
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function fmtValue(v: number): string {
  if (Math.abs(v) >= 1000) return v.toFixed(0);
  if (Math.abs(v) >= 10) return v.toFixed(2);
  return v.toFixed(3);
}

export function DataTable({ observations, unit, sourceLabel, sourceUrl }: Props) {
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(
    () => [...observations].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [observations],
  );
  const visible = expanded ? sorted : sorted.slice(0, 12);

  function onExpand() {
    setExpanded(true);
    trackEngage('table', 'click');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pseo:engage', { detail: { surface: 'table' } }));
    }
  }

  if (!observations.length) {
    return (
      <div className="rounded border border-dashed p-4 text-sm text-muted-foreground">
        No observations available.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded border">
      <table className="w-full text-sm">
        <caption className="sr-only">
          Observations in {unit}, newest first. Source: {sourceLabel}.
        </caption>
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2">Date</th>
            <th scope="col" className="px-3 py-2 text-right">Value ({unit})</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((o) => (
            <tr key={o.date} className="border-t">
              <td className="px-3 py-1.5">{fmtDate(o.date)}</td>
              <td className="px-3 py-1.5 text-right font-mono">{fmtValue(o.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <span>
          Source:{' '}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              className="underline underline-offset-2 hover:text-foreground"
              rel="noopener noreferrer"
              target="_blank"
            >
              {sourceLabel}
            </a>
          ) : (
            sourceLabel
          )}
        </span>
        {!expanded && sorted.length > 12 ? (
          <button
            type="button"
            onClick={onExpand}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Show all {sorted.length} rows
          </button>
        ) : null}
      </div>
    </div>
  );
}
