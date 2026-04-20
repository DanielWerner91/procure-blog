// Hardcoded pilot catalog for the procure.blog programmatic SEO pilot.
// 60 Energy indices (Phase 1 of 300-page pilot).
// Source of truth lives in procure-index `INDEX_DEFINITIONS`; this file is
// the deliberately-curated subset plus SEO-friendly slugs and display names
// chosen to match user queries.

export type PseoCategory = 'energy';

export interface PseoEntry {
  slug: string;
  indexId: string;
  category: PseoCategory;
  title: string;
  h1: string;
  intent: string;
  country: string;
  region: string;
}

export const PSEO_ENERGY: PseoEntry[] = [
  { slug: 'brent-crude-oil', indexId: 'brent', category: 'energy', title: 'Brent Crude Oil Price', h1: 'Brent crude oil price', intent: 'price', country: 'Global', region: 'Global' },
  { slug: 'wti-crude-oil-us', indexId: 'wti', category: 'energy', title: 'WTI Crude Oil Price (US)', h1: 'WTI crude oil price (United States)', intent: 'price', country: 'US', region: 'Americas' },
  { slug: 'dubai-crude-oil', indexId: 'oil_dubai', category: 'energy', title: 'Dubai Fateh Crude Oil Price', h1: 'Dubai Fateh crude oil price', intent: 'price', country: 'Global', region: 'Middle East & Africa' },
  { slug: 'global-crude-oil-average', indexId: 'oil_avg', category: 'energy', title: 'Global Crude Oil Average Price (Brent / Dubai / WTI)', h1: 'Global crude oil average price', intent: 'price', country: 'Global', region: 'Global' },
  { slug: 'apsp-crude-oil-average', indexId: 'oil_apsp', category: 'energy', title: 'APSP Crude Oil Spot Price', h1: 'APSP crude oil average petroleum spot price', intent: 'price', country: 'Global', region: 'Global' },

  { slug: 'henry-hub-natural-gas', indexId: 'natgas_hh', category: 'energy', title: 'Henry Hub Natural Gas Price (US)', h1: 'Henry Hub natural gas price', intent: 'price', country: 'US', region: 'Americas' },
  { slug: 'ttf-natural-gas-europe', indexId: 'natgas_eu', category: 'energy', title: 'TTF Natural Gas Price (Europe)', h1: 'TTF natural gas price (Europe)', intent: 'price', country: 'Europe', region: 'Europe' },
  { slug: 'japan-lng-natural-gas', indexId: 'natgas_jp', category: 'energy', title: 'Japan LNG Natural Gas Price', h1: 'Japan LNG natural gas price', intent: 'price', country: 'Japan', region: 'Asia-Pacific' },
  { slug: 'russia-natural-gas', indexId: 'natgas_ru', category: 'energy', title: 'Russia Natural Gas Price', h1: 'Russia natural gas price', intent: 'price', country: 'Russia', region: 'Middle East & Africa' },

  { slug: 'australian-coal', indexId: 'coal_au', category: 'energy', title: 'Australian Coal Price', h1: 'Australian coal price', intent: 'price', country: 'Australia', region: 'Asia-Pacific' },

  { slug: 'us-gasoline-regular', indexId: 'gasoline', category: 'energy', title: 'US Regular Gasoline Price', h1: 'US regular gasoline price', intent: 'price', country: 'US', region: 'Americas' },
  { slug: 'us-diesel-no2', indexId: 'diesel', category: 'energy', title: 'US No. 2 Diesel Fuel Price', h1: 'US No. 2 diesel fuel price', intent: 'price', country: 'US', region: 'Americas' },
  { slug: 'us-propane', indexId: 'propane', category: 'energy', title: 'US Propane Price (Mont Belvieu)', h1: 'US propane price (Mont Belvieu)', intent: 'price', country: 'US', region: 'Americas' },

  { slug: 'global-energy-index-imf', indexId: 'idx_energy', category: 'energy', title: 'Global Energy Price Index (IMF)', h1: 'Global energy price index (IMF)', intent: 'index', country: 'Global', region: 'Global' },

  { slug: 'us-gasoline-retail', indexId: 'eia_gas_us', category: 'energy', title: 'US Retail Gasoline Price (All Grades)', h1: 'US retail gasoline price (all grades)', intent: 'price', country: 'US', region: 'Americas' },
  { slug: 'east-coast-gasoline-retail', indexId: 'eia_gas_east', category: 'energy', title: 'East Coast Retail Gasoline Price (PADD 1)', h1: 'East Coast retail gasoline price (PADD 1)', intent: 'price', country: 'US', region: 'Americas' },
  { slug: 'midwest-gasoline-retail', indexId: 'eia_gas_midwest', category: 'energy', title: 'Midwest Retail Gasoline Price (PADD 2)', h1: 'Midwest retail gasoline price (PADD 2)', intent: 'price', country: 'US', region: 'Americas' },
  { slug: 'gulf-coast-gasoline-retail', indexId: 'eia_gas_gulf', category: 'energy', title: 'Gulf Coast Retail Gasoline Price (PADD 3)', h1: 'Gulf Coast retail gasoline price (PADD 3)', intent: 'price', country: 'US', region: 'Americas' },

  { slug: 'us-energy-cpi', indexId: 'cpi_energy', category: 'energy', title: 'US Energy CPI', h1: 'US energy CPI', intent: 'cpi', country: 'US', region: 'Americas' },
  { slug: 'uk-energy-cpi', indexId: 'cpi_energy_uk', category: 'energy', title: 'UK Energy CPI', h1: 'UK energy CPI', intent: 'cpi', country: 'UK', region: 'Europe' },
  { slug: 'germany-energy-cpi', indexId: 'cpi_energy_de', category: 'energy', title: 'Germany Energy CPI', h1: 'Germany energy CPI', intent: 'cpi', country: 'Germany', region: 'Europe' },
  { slug: 'france-energy-cpi', indexId: 'cpi_energy_fr', category: 'energy', title: 'France Energy CPI', h1: 'France energy CPI', intent: 'cpi', country: 'France', region: 'Europe' },
  { slug: 'italy-energy-cpi', indexId: 'cpi_energy_it', category: 'energy', title: 'Italy Energy CPI', h1: 'Italy energy CPI', intent: 'cpi', country: 'Italy', region: 'Europe' },
  { slug: 'spain-energy-cpi', indexId: 'cpi_energy_es', category: 'energy', title: 'Spain Energy CPI', h1: 'Spain energy CPI', intent: 'cpi', country: 'Spain', region: 'Europe' },
  { slug: 'netherlands-energy-cpi', indexId: 'cpi_energy_nl', category: 'energy', title: 'Netherlands Energy CPI', h1: 'Netherlands energy CPI', intent: 'cpi', country: 'Netherlands', region: 'Europe' },
  { slug: 'belgium-energy-cpi', indexId: 'cpi_energy_be', category: 'energy', title: 'Belgium Energy CPI', h1: 'Belgium energy CPI', intent: 'cpi', country: 'Belgium', region: 'Europe' },
  { slug: 'poland-energy-cpi', indexId: 'cpi_energy_pl', category: 'energy', title: 'Poland Energy CPI', h1: 'Poland energy CPI', intent: 'cpi', country: 'Poland', region: 'Europe' },
  { slug: 'sweden-energy-cpi', indexId: 'cpi_energy_se', category: 'energy', title: 'Sweden Energy CPI', h1: 'Sweden energy CPI', intent: 'cpi', country: 'Sweden', region: 'Europe' },
  { slug: 'norway-energy-cpi', indexId: 'cpi_energy_no', category: 'energy', title: 'Norway Energy CPI', h1: 'Norway energy CPI', intent: 'cpi', country: 'Norway', region: 'Europe' },
  { slug: 'switzerland-energy-cpi', indexId: 'cpi_energy_ch', category: 'energy', title: 'Switzerland Energy CPI', h1: 'Switzerland energy CPI', intent: 'cpi', country: 'Switzerland', region: 'Europe' },
  { slug: 'turkey-energy-cpi', indexId: 'cpi_energy_tr', category: 'energy', title: 'Turkey Energy CPI', h1: 'Turkey energy CPI', intent: 'cpi', country: 'Turkey', region: 'Europe' },
  { slug: 'japan-energy-cpi', indexId: 'cpi_energy_jp', category: 'energy', title: 'Japan Energy CPI', h1: 'Japan energy CPI', intent: 'cpi', country: 'Japan', region: 'Asia-Pacific' },
  { slug: 'south-korea-energy-cpi', indexId: 'cpi_energy_kr', category: 'energy', title: 'South Korea Energy CPI', h1: 'South Korea energy CPI', intent: 'cpi', country: 'South Korea', region: 'Asia-Pacific' },
  { slug: 'canada-energy-cpi', indexId: 'cpi_energy_ca', category: 'energy', title: 'Canada Energy CPI', h1: 'Canada energy CPI', intent: 'cpi', country: 'Canada', region: 'Americas' },
  { slug: 'mexico-energy-cpi', indexId: 'cpi_energy_mx', category: 'energy', title: 'Mexico Energy CPI', h1: 'Mexico energy CPI', intent: 'cpi', country: 'Mexico', region: 'Americas' },
  { slug: 'south-africa-energy-cpi', indexId: 'cpi_energy_za', category: 'energy', title: 'South Africa Energy CPI', h1: 'South Africa energy CPI', intent: 'cpi', country: 'South Africa', region: 'Middle East & Africa' },
  { slug: 'israel-energy-cpi', indexId: 'cpi_energy_il', category: 'energy', title: 'Israel Energy CPI', h1: 'Israel energy CPI', intent: 'cpi', country: 'Israel', region: 'Middle East & Africa' },
  { slug: 'russia-energy-cpi', indexId: 'cpi_energy_ru', category: 'energy', title: 'Russia Energy CPI', h1: 'Russia energy CPI', intent: 'cpi', country: 'Russia', region: 'Middle East & Africa' },
  { slug: 'new-zealand-energy-cpi', indexId: 'cpi_energy_nz', category: 'energy', title: 'New Zealand Energy CPI', h1: 'New Zealand energy CPI', intent: 'cpi', country: 'New Zealand', region: 'Asia-Pacific' },
  { slug: 'indonesia-energy-cpi', indexId: 'cpi_energy_id', category: 'energy', title: 'Indonesia Energy CPI', h1: 'Indonesia energy CPI', intent: 'cpi', country: 'Indonesia', region: 'Asia-Pacific' },
  { slug: 'thailand-energy-cpi', indexId: 'cpi_energy_th', category: 'energy', title: 'Thailand Energy CPI', h1: 'Thailand energy CPI', intent: 'cpi', country: 'Thailand', region: 'Asia-Pacific' },
  { slug: 'chile-energy-cpi', indexId: 'cpi_energy_cl', category: 'energy', title: 'Chile Energy CPI', h1: 'Chile energy CPI', intent: 'cpi', country: 'Chile', region: 'Americas' },
  { slug: 'argentina-energy-cpi', indexId: 'cpi_energy_ar', category: 'energy', title: 'Argentina Energy CPI', h1: 'Argentina energy CPI', intent: 'cpi', country: 'Argentina', region: 'Americas' },
  { slug: 'saudi-arabia-energy-cpi', indexId: 'cpi_energy_sa_ksa', category: 'energy', title: 'Saudi Arabia Energy CPI', h1: 'Saudi Arabia energy CPI', intent: 'cpi', country: 'Saudi Arabia', region: 'Middle East & Africa' },
  { slug: 'egypt-energy-cpi', indexId: 'cpi_energy_eg', category: 'energy', title: 'Egypt Energy CPI', h1: 'Egypt energy CPI', intent: 'cpi', country: 'Egypt', region: 'Middle East & Africa' },
  { slug: 'singapore-energy-cpi', indexId: 'cpi_energy_sg', category: 'energy', title: 'Singapore Energy CPI', h1: 'Singapore energy CPI', intent: 'cpi', country: 'Singapore', region: 'Asia-Pacific' },
  { slug: 'malaysia-energy-cpi', indexId: 'cpi_energy_my', category: 'energy', title: 'Malaysia Energy CPI', h1: 'Malaysia energy CPI', intent: 'cpi', country: 'Malaysia', region: 'Asia-Pacific' },
  { slug: 'pakistan-energy-cpi', indexId: 'cpi_energy_pk', category: 'energy', title: 'Pakistan Energy CPI', h1: 'Pakistan energy CPI', intent: 'cpi', country: 'Pakistan', region: 'Asia-Pacific' },
  { slug: 'euro-area-energy-hicp', indexId: 'cpi_energy_eu', category: 'energy', title: 'Euro Area Energy HICP', h1: 'Euro area energy HICP', intent: 'cpi', country: 'Euro Area', region: 'Europe' },

  { slug: 'us-fuel-ppi', indexId: 'ppi_fuel', category: 'energy', title: 'US Fuels & Related Products PPI', h1: 'US fuels & related products PPI', intent: 'ppi', country: 'US', region: 'Americas' },
  { slug: 'us-petroleum-coal-ppi', indexId: 'ppi_petroleum', category: 'energy', title: 'US Petroleum & Coal Products PPI', h1: 'US petroleum & coal products PPI', intent: 'ppi', country: 'US', region: 'Americas' },
  { slug: 'us-petroleum-products-ppi', indexId: 'ppi_petroleum_prods', category: 'energy', title: 'US Petroleum Products PPI', h1: 'US petroleum products PPI', intent: 'ppi', country: 'US', region: 'Americas' },
  { slug: 'us-lubricants-ppi', indexId: 'ppi_lubricants', category: 'energy', title: 'US Petroleum Lubricants PPI', h1: 'US petroleum lubricants & greases PPI', intent: 'ppi', country: 'US', region: 'Americas' },
  { slug: 'us-jet-fuel-ppi', indexId: 'ppi_jet_fuel', category: 'energy', title: 'US Jet Fuel PPI', h1: 'US jet fuel PPI', intent: 'ppi', country: 'US', region: 'Americas' },
  { slug: 'us-jet-fuel-refinery-ppi', indexId: 'ppi_jet_fuel_refinery', category: 'energy', title: 'US Jet Fuel (Refineries) PPI', h1: 'US jet fuel (refineries) PPI', intent: 'ppi', country: 'US', region: 'Americas' },
  { slug: 'us-petroleum-wholesale-ppi', indexId: 'ppi_petro_wholesale', category: 'energy', title: 'US Petroleum Wholesale PPI', h1: 'US petroleum & petroleum products wholesale PPI', intent: 'ppi', country: 'US', region: 'Americas' },
  { slug: 'us-electric-power-ppi', indexId: 'ppi_electric_power', category: 'energy', title: 'US Electric Power Generation PPI', h1: 'US electric power generation & distribution PPI', intent: 'ppi', country: 'US', region: 'Americas' },
  { slug: 'us-electricity-distribution-ppi', indexId: 'ppi_elec', category: 'energy', title: 'US Electricity Distribution PPI', h1: 'US electric power distribution PPI', intent: 'ppi', country: 'US', region: 'Americas' },
  { slug: 'us-natural-gas-distribution-ppi', indexId: 'ppi_gas_dist', category: 'energy', title: 'US Natural Gas Distribution PPI', h1: 'US natural gas distribution PPI', intent: 'ppi', country: 'US', region: 'Americas' },
  { slug: 'us-electricity-retail-price', indexId: 'elec_us', category: 'energy', title: 'US Average Retail Electricity Price', h1: 'US average retail electricity price', intent: 'price', country: 'US', region: 'Americas' },
];

export const PSEO_CATALOG: readonly PseoEntry[] = PSEO_ENERGY;

export function getEntryBySlug(slug: string): PseoEntry | undefined {
  return PSEO_CATALOG.find((e) => e.slug === slug);
}

export function getEntriesByCategory(category: PseoCategory): PseoEntry[] {
  return PSEO_CATALOG.filter((e) => e.category === category);
}

export const PSEO_CATEGORIES: { slug: PseoCategory; label: string; description: string }[] = [
  {
    slug: 'energy',
    label: 'Energy',
    description: 'Crude oil, natural gas, coal, electricity, and fuel price data from FRED, EIA, and IMF.',
  },
];

export function getCategory(slug: string) {
  return PSEO_CATEGORIES.find((c) => c.slug === slug);
}
