export interface ProcurementArticle {
  id: string;
  content_trend_id: string | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string;
  source_url: string | null;
  source_name: string | null;
  meta_description: string | null;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  posted_to_x: boolean;
  posted_to_x_at: string | null;
  x_post_id: string | null;
}
