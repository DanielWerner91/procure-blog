// Deterministic 150-word context generator. Pulls trend direction, magnitude,
// and latest-print framing from the observations. Avoids LLM generation on
// purpose — keeps the content factual, bounded, and reproducible, and stays on
// the safe side of the "AI slop" line in Google's 2025-2026 guidance.

import type { IndexData } from './index-fetch';
import type { PseoEntry } from './catalog';

function fmtMonth(iso: string | null): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function fmtValue(value: number | null, unit: string): string {
  if (value === null) return '';
  const trimmed = Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(2);
  return `${trimmed} ${unit}`;
}

function trendLabel(change: number | null): string {
  if (change === null) return 'sideways';
  const abs = Math.abs(change);
  if (abs < 1) return 'essentially flat';
  if (change > 0) {
    if (abs > 15) return 'sharply higher';
    if (abs > 5) return 'notably higher';
    return 'modestly higher';
  }
  if (abs > 15) return 'sharply lower';
  if (abs > 5) return 'notably lower';
  return 'modestly lower';
}

function pctFmt(change: number | null): string {
  if (change === null) return '';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

export function buildContext(entry: PseoEntry, data: IndexData): string {
  const def = data.definition;
  const value = fmtValue(data.latest.value, def.unit);
  const month = fmtMonth(data.latest.date);
  const label = entry.h1;

  const obs = data.observations;
  const twelveMonthsAgo = obs.length >= 13 ? obs[obs.length - 13] : null;
  const twelveAgoValue = twelveMonthsAgo ? fmtValue(twelveMonthsAgo.value, def.unit) : null;
  const twelveAgoMonth = twelveMonthsAgo ? fmtMonth(twelveMonthsAgo.date) : null;

  const year = obs.length >= 13 ? obs.slice(-13) : obs;
  const yearValues = year.map((o) => o.value);
  const yearHigh = yearValues.length ? Math.max(...yearValues) : null;
  const yearLow = yearValues.length ? Math.min(...yearValues) : null;

  const trend12 = trendLabel(data.change12m);
  const trend3 = trendLabel(data.change3m);
  const trend1 = trendLabel(data.change1m);

  const parts: string[] = [];

  parts.push(
    `As of ${month || 'the latest print'}, ${label.toLowerCase()} stands at ${value || '—'} (${def.source}: ${def.seriesId}).`,
  );

  if (data.change12m !== null) {
    parts.push(
      `That is ${pctFmt(data.change12m)} versus ${twelveAgoMonth ?? 'twelve months earlier'} (${twelveAgoValue ?? 'prior print'}), a ${trend12} trajectory over the past year.`,
    );
  }

  if (data.change3m !== null && data.change1m !== null) {
    parts.push(
      `Over the last three months the series has moved ${pctFmt(data.change3m)} and ${trend3}; month-on-month it is ${pctFmt(data.change1m)} and ${trend1}.`,
    );
  }

  if (yearHigh !== null && yearLow !== null && yearHigh !== yearLow) {
    parts.push(
      `The trailing twelve-month range runs from ${fmtValue(yearLow, def.unit)} to ${fmtValue(yearHigh, def.unit)}.`,
    );
  }

  parts.push(
    `Procurement teams tracking ${entry.country === 'Global' ? 'global energy exposure' : `${entry.country} energy exposure`} should treat this series as a ${def.frequency === 'W' || def.frequency === 'D' ? 'high-frequency' : 'monthly'} benchmark when repricing contracts, modelling cost-pass-through, or reviewing supplier indexation clauses.`,
  );

  return parts.filter(Boolean).join(' ');
}
