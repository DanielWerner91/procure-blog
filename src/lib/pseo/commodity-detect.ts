// Keyword → promoted pSEO slug mapping. Scans article text (title, excerpt,
// body) and returns the set of promoted data pages to link from the article.
//
// Only promoted slugs are listed here. Linking to draft (noindex) pages from
// editorial articles is useless for SEO — Google follows the link but refuses
// to rank the target. Keep this list in sync with pseo_pages.status='promoted'.

interface Match {
  slug: string;
  category: 'energy' | 'metals';
  label: string;
  patterns: RegExp[];
}

const MATCHERS: Match[] = [
  {
    slug: 'brent-crude-oil',
    category: 'energy',
    label: 'Brent crude oil price',
    patterns: [/\bbrent\b/i, /\bbrent crude\b/i],
  },
  {
    slug: 'wti-crude-oil-us',
    category: 'energy',
    label: 'WTI crude oil price',
    patterns: [/\bwti\b/i, /\bwest texas intermediate\b/i],
  },
  {
    slug: 'henry-hub-natural-gas',
    category: 'energy',
    label: 'Henry Hub natural gas price',
    patterns: [/\bhenry hub\b/i, /\bnatural gas\b/i, /\bnat gas\b/i],
  },
  {
    slug: 'us-gasoline-regular',
    category: 'energy',
    label: 'US regular gasoline price',
    patterns: [/\bgasoline\b/i, /\bpetrol\b/i],
  },
  {
    slug: 'us-diesel-no2',
    category: 'energy',
    label: 'US No. 2 diesel fuel price',
    patterns: [/\bdiesel\b/i],
  },
  {
    slug: 'copper-price-lme',
    category: 'metals',
    label: 'Copper price (LME)',
    patterns: [/\bcopper\b/i],
  },
  {
    slug: 'aluminum-price-lme',
    category: 'metals',
    label: 'Aluminum price (LME)',
    patterns: [/\baluminum\b/i, /\baluminium\b/i],
  },
  {
    slug: 'nickel-price-lme',
    category: 'metals',
    label: 'Nickel price (LME)',
    patterns: [/\bnickel\b/i],
  },
  {
    slug: 'lithium-carbonate-price',
    category: 'metals',
    label: 'Lithium carbonate price',
    patterns: [/\blithium\b/i],
  },
  {
    slug: 'global-metals-index-imf',
    category: 'metals',
    label: 'Global metals price index (IMF)',
    patterns: [/\bmetals index\b/i, /\bbase metals\b/i, /\bmetals market\b/i],
  },
];

export interface CommodityLink {
  slug: string;
  category: string;
  label: string;
  url: string;
}

export function detectCommodityLinks(
  text: string,
  { limit = 3 }: { limit?: number } = {},
): CommodityLink[] {
  const stripped = text.replace(/<[^>]+>/g, ' ');
  const hits: Array<CommodityLink & { score: number }> = [];

  for (const m of MATCHERS) {
    let score = 0;
    for (const re of m.patterns) {
      const matches = stripped.match(new RegExp(re.source, re.flags + 'g'));
      if (matches) score += matches.length;
    }
    if (score > 0) {
      hits.push({
        slug: m.slug,
        category: m.category,
        label: m.label,
        url: `/data/${m.category}/${m.slug}`,
        score,
      });
    }
  }

  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit).map(({ slug, category, label, url }) => ({
    slug,
    category,
    label,
    url,
  }));
}
