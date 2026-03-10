export const SITE_NAME = 'procure.blog';
export const SITE_DESCRIPTION =
  'The latest news on AI in procurement — new platforms, funding rounds, enterprise adoption, and industry analysis.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://procure.blog';

export const CATEGORIES = [
  { slug: 'procurement_platform', label: 'Platforms' },
  { slug: 'spend_analytics', label: 'Spend Analytics' },
  { slug: 'supplier_management', label: 'Supplier Management' },
  { slug: 'contract_intelligence', label: 'Contract Intelligence' },
  { slug: 'funding', label: 'Funding' },
  { slug: 'partnership', label: 'Partnerships' },
  { slug: 'product_launch', label: 'Product Launches' },
  { slug: 'enterprise_adoption', label: 'Enterprise Adoption' },
  { slug: 'policy', label: 'Policy & Regulation' },
  { slug: 'research', label: 'Research' },
  { slug: 'other', label: 'Other' },
] as const;

export const ARTICLES_PER_PAGE = 12;

export function categoryLabel(slug: string): string {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return cat?.label ?? slug.replace(/_/g, ' ');
}
