export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  body?: string;
  excerpt?: string;
  featured_image?: string;
  featured_image_caption?: string;
  author_id?: string;
  category_id?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  is_featured: boolean;
  is_breaking: boolean;
  is_trending: boolean;
  is_sponsored: boolean;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  social_image?: string;
  published_at?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  category?: Category;
  author?: AdminUser;
  tags?: Tag[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash?: string;
  display_name: string;
  role: 'admin' | 'editor' | 'author';
  avatar_url?: string;
  bio?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  filename: string;
  url: string;
  alt_text?: string;
  mime_type?: string;
  size_bytes?: number;
  uploaded_by?: string;
  created_at: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  slot_id: string;
  placement: string;
  ad_type: 'html' | 'image' | 'script';
  content?: string;
  image_url?: string;
  link_url?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value?: string;
  updated_at: string;
}
