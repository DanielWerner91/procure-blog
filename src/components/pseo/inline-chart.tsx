// Zero-dependency inline SVG line chart. Renders server-side so the chart is
// present in the initial HTML payload — Google indexes what crawlers see, and
// the chart is a trust/credibility signal for Dataset structured data.

import type { IndexObservation } from '@/lib/pseo/index-fetch';

interface Props {
  observations: IndexObservation[];
  unit: string;
  title: string;
  className?: string;
}

const WIDTH = 800;
const HEIGHT = 280;
const PAD_L = 48;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 32;

function niceStep(range: number): number {
  if (range === 0) return 1;
  const log10 = Math.log10(range);
  const step = Math.pow(10, Math.floor(log10));
  const normalized = range / step;
  if (normalized < 2) return step / 5;
  if (normalized < 5) return step / 2;
  return step;
}

function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min];
  const step = niceStep((max - min) / count);
  const first = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = first; v <= max + step * 0.001; v += step) ticks.push(v);
  return ticks;
}

function fmtTickValue(v: number): string {
  if (Math.abs(v) >= 1000) return v.toFixed(0);
  if (Math.abs(v) >= 10) return v.toFixed(1);
  return v.toFixed(2);
}

function fmtMonth(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  } catch {
    return iso;
  }
}

export function InlineChart({ observations, unit, title, className }: Props) {
  if (!observations.length) {
    return (
      <div className={`flex h-[280px] w-full items-center justify-center rounded border border-dashed text-sm text-muted-foreground ${className ?? ''}`}>
        Chart data unavailable right now.
      </div>
    );
  }

  const values = observations.map((o) => o.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const padding = (maxV - minV) * 0.1 || Math.abs(maxV) * 0.05 || 1;
  const yMin = minV - padding;
  const yMax = maxV + padding;

  const innerW = WIDTH - PAD_L - PAD_R;
  const innerH = HEIGHT - PAD_T - PAD_B;

  const xAt = (i: number) => PAD_L + (i / Math.max(1, observations.length - 1)) * innerW;
  const yAt = (v: number) => PAD_T + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const linePath = observations
    .map((o, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(2)},${yAt(o.value).toFixed(2)}`)
    .join(' ');

  const areaPath =
    `M${xAt(0).toFixed(2)},${(PAD_T + innerH).toFixed(2)} ` +
    observations
      .map((o, i) => `L${xAt(i).toFixed(2)},${yAt(o.value).toFixed(2)}`)
      .join(' ') +
    ` L${xAt(observations.length - 1).toFixed(2)},${(PAD_T + innerH).toFixed(2)} Z`;

  const yTicks = niceTicks(yMin, yMax, 4);
  const xIndices = [0, Math.floor(observations.length / 3), Math.floor((observations.length * 2) / 3), observations.length - 1].filter(
    (v, i, a) => a.indexOf(v) === i && v >= 0 && v < observations.length,
  );

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`${title} chart: ${observations.length} observations from ${fmtMonth(observations[0].date)} to ${fmtMonth(observations[observations.length - 1].date)}, in ${unit}.`}
      className={`h-auto w-full ${className ?? ''}`}
    >
      <defs>
        <linearGradient id="pseo-area-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((t) => (
        <g key={`y-${t}`}>
          <line
            x1={PAD_L}
            x2={WIDTH - PAD_R}
            y1={yAt(t)}
            y2={yAt(t)}
            stroke="currentColor"
            strokeOpacity={0.08}
          />
          <text
            x={PAD_L - 8}
            y={yAt(t) + 4}
            fontSize="10"
            fill="currentColor"
            fillOpacity="0.6"
            textAnchor="end"
          >
            {fmtTickValue(t)}
          </text>
        </g>
      ))}

      {xIndices.map((i) => (
        <text
          key={`x-${i}`}
          x={xAt(i)}
          y={HEIGHT - 8}
          fontSize="10"
          fill="currentColor"
          fillOpacity="0.6"
          textAnchor="middle"
        >
          {fmtMonth(observations[i].date)}
        </text>
      ))}

      <path d={areaPath} fill="url(#pseo-area-gradient)" />
      <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
