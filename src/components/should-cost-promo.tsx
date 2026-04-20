import Link from 'next/link';
import { ArrowRight, TrendingDown, TrendingUp, Check } from 'lucide-react';

/**
 * Should-cost model promo, sits between the hero and the news grid.
 * The "product fragment" on the right is a real cost stack example
 * (aluminum can, 12oz) — concrete numbers make the value land faster
 * than an abstract mockup.
 */
export function ShouldCostPromo() {
  const procureIndexUrl = process.env.NEXT_PUBLIC_PROCURE_INDEX_URL || 'https://index.procure.blog';
  const modelUrl = `${procureIndexUrl}/model`;

  return (
    <section className="border-b border-border/40 bg-card">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          {/* LEFT: copy + CTA */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
              New · ProcureIndex
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Stop accepting supplier price hikes at face value.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Build a should-cost model for any product in minutes. Map each cost component
              to a live price index — aluminum, steel, energy, labor — and see what the
              price <em>should</em> have done vs. what your supplier is charging.
            </p>

            <ul className="mt-5 space-y-2 text-[14px] text-foreground">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>1,900+ commodity &amp; service price indices from FRED, Eurostat, World Bank, EIA</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Drop in a supplier contract — AI extracts components &amp; builds the model</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Export branded PDF / Excel / PowerPoint for your next negotiation</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={modelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
              >
                Build your should-cost model
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-[13px] text-muted-foreground">
                Free · 3 models per month · no credit card
              </span>
            </div>
          </div>

          {/* RIGHT: product fragment — cost stack */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-accent/10 via-accent/0 to-accent/5 blur-2xl" aria-hidden />
            <CostStackFragment />
          </div>
        </div>
      </div>
    </section>
  );
}

function CostStackFragment() {
  // Aluminum can, 12oz — recognizable SKU for any procurement reader.
  // Numbers are illustrative, labelled "Sample" so nobody reads them as a live quote.
  const components = [
    { name: 'Aluminum ingot', weight: 60, cost: 0.0438, indexId: 'FRED · WPU10250105', delta: +4.2 },
    { name: 'Smelting & forming', weight: 22, cost: 0.0161, indexId: 'FRED · PCU3315 · Energy-adj.', delta: +1.1 },
    { name: 'Coating & printing', weight: 10, cost: 0.0073, indexId: 'FRED · PCU325510', delta: -0.8 },
    { name: 'Logistics (US)', weight: 5, cost: 0.0036, indexId: 'BLS · Truckload PPI', delta: -2.4 },
    { name: 'Supplier margin', weight: 3, cost: 0.0022, indexId: 'Target 3%', delta: 0 },
  ];

  const total = components.reduce((sum, c) => sum + c.cost, 0);
  const supplierQuote = 0.0812;
  const gap = supplierQuote - total;
  const gapPct = (gap / total) * 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/5">
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/50 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
            <span className="text-[11px] font-bold text-accent">P</span>
          </div>
          <div className="text-[13px] font-semibold text-foreground">Should-Cost Model</div>
        </div>
        <div className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          Sample
        </div>
      </div>

      <div className="p-5">
        {/* Product line */}
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Product</div>
            <div className="text-[15px] font-semibold text-foreground">Aluminum beverage can · 12oz</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Supplier quote</div>
            <div className="text-[15px] font-mono font-semibold text-foreground">${supplierQuote.toFixed(4)}</div>
          </div>
        </div>

        {/* Cost stack */}
        <div className="space-y-2">
          {components.map((c) => (
            <div key={c.name} className="rounded-lg border border-border/60 bg-card px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-foreground">{c.name}</span>
                    <span className="text-[10px] font-medium text-muted-foreground">{c.weight}%</span>
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                    {c.indexId}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                      c.delta > 0
                        ? 'bg-red-50 text-red-700'
                        : c.delta < 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-muted text-muted-foreground',
                    ].join(' ')}
                  >
                    {c.delta > 0 ? <TrendingUp className="h-3 w-3" /> : c.delta < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                    {c.delta > 0 ? '+' : ''}{c.delta.toFixed(1)}%
                  </span>
                  <span className="font-mono text-[13px] font-semibold tabular-nums text-foreground">
                    ${c.cost.toFixed(4)}
                  </span>
                </div>
              </div>
              {/* Weight bar */}
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent/60"
                  style={{ width: `${c.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-medium text-foreground">Modelled should-cost</div>
            <div className="font-mono text-[15px] font-bold tabular-nums text-foreground">
              ${total.toFixed(4)}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg border border-accent/30 bg-accent/5 px-3 py-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                Negotiation gap
              </div>
              <div className="text-[11px] text-muted-foreground">
                Supplier quote vs. modelled cost
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[15px] font-bold tabular-nums text-accent">
                +${gap.toFixed(4)}
              </div>
              <div className="text-[11px] font-medium text-accent">
                {gapPct.toFixed(1)}% above model
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
