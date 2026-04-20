import type { IndexDefinition } from './index-fetch';

const LABELS: Record<string, string> = {
  FRED: 'Federal Reserve Economic Data (FRED)',
  Eurostat: 'Eurostat',
  EIA: 'U.S. Energy Information Administration (EIA)',
  USDA: 'USDA NASS Quick Stats',
  DBnomics: 'DBnomics',
  'World Bank': 'World Bank',
  FAO: 'FAO',
  IMF: 'International Monetary Fund (IMF)',
  Custom: 'procure-index',
};

export function sourceLabel(def: IndexDefinition): string {
  return LABELS[def.source] ?? def.source;
}

export function sourceUrl(def: IndexDefinition): string | undefined {
  switch (def.source) {
    case 'FRED':
      return `https://fred.stlouisfed.org/series/${def.seriesId}`;
    case 'EIA':
      return 'https://www.eia.gov/opendata/';
    case 'USDA':
      return 'https://quickstats.nass.usda.gov/';
    case 'DBnomics':
      return `https://db.nomics.world/${def.seriesId.split('/').slice(0, 2).join('/')}`;
    case 'Eurostat':
      return 'https://ec.europa.eu/eurostat/';
    case 'World Bank':
      return 'https://data.worldbank.org/';
    case 'FAO':
      return 'https://www.fao.org/worldfoodsituation/foodpricesindex/en/';
    default:
      return undefined;
  }
}

export function datasetLicense(def: IndexDefinition): string {
  switch (def.source) {
    case 'FRED':
      return 'https://fred.stlouisfed.org/legal/';
    case 'Eurostat':
      return 'https://ec.europa.eu/eurostat/about-us/policies/copyright';
    case 'EIA':
      return 'https://www.eia.gov/about/copyrights_reuse.php';
    case 'USDA':
      return 'https://www.nass.usda.gov/Publications/usda_data_terms_of_service.php';
    case 'DBnomics':
      return 'https://db.nomics.world/';
    default:
      return 'https://creativecommons.org/licenses/by/4.0/';
  }
}
