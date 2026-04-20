import { SITE_URL } from '@/lib/constants';
import type { IndexData } from './index-fetch';
import type { PseoEntry } from './catalog';
import { datasetLicense, sourceLabel, sourceUrl } from './source-meta';

export function buildDatasetJsonLd(entry: PseoEntry, data: IndexData) {
  const def = data.definition;
  const url = `${SITE_URL}/data/${entry.category}/${entry.slug}`;
  const firstDate = data.observations[0]?.date;
  const lastDate = data.observations[data.observations.length - 1]?.date;
  const temporalCoverage = firstDate && lastDate ? `${firstDate}/${lastDate}` : undefined;

  const description = `${entry.h1} (${def.source} series ${def.seriesId}). ${def.frequency === 'D' ? 'Daily' : def.frequency === 'W' ? 'Weekly' : def.frequency === 'M' ? 'Monthly' : 'Periodic'} observations in ${def.unit}.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: entry.title,
    description,
    url,
    identifier: def.seriesId,
    creator: {
      '@type': 'Organization',
      name: sourceLabel(def),
      url: sourceUrl(def),
    },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: sourceUrl(def),
      },
    ],
    temporalCoverage,
    spatialCoverage: entry.country
      ? {
          '@type': 'Place',
          name: entry.country,
        }
      : undefined,
    variableMeasured: def.name,
    measurementTechnique: def.source,
    license: datasetLicense(def),
    isAccessibleForFree: true,
    keywords: [entry.category, def.category, def.subcategory, entry.country].filter(Boolean).join(', '),
  };
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
