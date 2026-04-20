import { SITE_URL } from '@/lib/constants';
import type { IndexData } from './index-fetch';
import type { PseoEntry } from './catalog';
import { datasetLicense, sourceLabel, sourceUrl } from './source-meta';

export function buildDatasetJsonLd(entry: PseoEntry, data: IndexData) {
  const def = data.definition;
  const url = `${SITE_URL}/data/${entry.category}/${entry.slug}`;
  const firstDate = data.observations[0]?.date;
  const lastDate = data.observations[data.observations.length - 1]?.date;

  const description = `${entry.h1} (${def.source} series ${def.seriesId}). ${def.frequency === 'D' ? 'Daily' : def.frequency === 'W' ? 'Weekly' : def.frequency === 'M' ? 'Monthly' : 'Periodic'} observations in ${def.unit}.`;

  const creatorUrl = sourceUrl(def);
  const creator: Record<string, string> = {
    '@type': 'Organization',
    name: sourceLabel(def),
  };
  if (creatorUrl) creator.url = creatorUrl;

  const distribution: Record<string, string>[] = [];
  if (creatorUrl) {
    distribution.push({
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: creatorUrl,
    });
  }

  const out: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: entry.title,
    description,
    url,
    identifier: def.seriesId,
    creator,
    variableMeasured: {
      '@type': 'PropertyValue',
      name: def.name,
      unitText: def.unit,
    },
    measurementTechnique: def.source,
    license: datasetLicense(def),
    isAccessibleForFree: true,
    keywords: [entry.category, def.category, def.subcategory, entry.country].filter(Boolean).join(', '),
  };
  if (distribution.length) out.distribution = distribution;
  if (firstDate && lastDate) out.temporalCoverage = `${firstDate}/${lastDate}`;
  if (firstDate) out.datePublished = firstDate;
  if (lastDate) out.dateModified = lastDate;
  if (entry.country) {
    out.spatialCoverage = { '@type': 'Place', name: entry.country };
  }
  return out;
}

export function buildBreadcrumbJsonLd(entry: PseoEntry, categoryLabel: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Data', item: `${SITE_URL}/data` },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryLabel,
        item: `${SITE_URL}/data/${entry.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: entry.title,
        item: `${SITE_URL}/data/${entry.category}/${entry.slug}`,
      },
    ],
  };
}
